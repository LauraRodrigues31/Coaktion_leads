import { QUESTIONS, CARGO_OPTIONS, type CompanyTag } from "./questions";

export interface AnswerRecord {
  question_id: string;
  question_text: string;
  company_tag: CompanyTag;
  category: string;
  crm_field: string;
  answer: string;
  answer_label: string;
  score_aktie: number;
  score_kompelys: number;
  dor?: string;
}

export interface Profile {
  slug: string;
  titulo: string;
  frase: string;
}

export interface Reading {
  score_aktie: number;
  score_kompelys: number;
  empresa_principal: "aktie" | "kompelys" | "ambas";
  empresa_secundaria: "aktie" | "kompelys" | "nenhuma";
  dor_principal: string | null;
  dor_secundaria: string | null;
  perguntas_aktie_respondidas: number;
  perguntas_kompelys_respondidas: number;
  qualificacao: "A" | "B" | "C";
  perfil: Profile;
  respostas: AnswerRecord[];
}

export function buildAnswerRecords(answers: Record<string, string>): AnswerRecord[] {
  const records: AnswerRecord[] = [];
  for (const question of Object.values(QUESTIONS)) {
    const value = answers[question.id];
    if (!value) continue;
    const optionValue = question.id === "Q01" && value.startsWith("outra:") ? "outra" : value;
    const option = question.options.find((o) => o.value === optionValue);
    if (!option) continue;
    records.push({
      question_id: question.id,
      question_text: question.text,
      company_tag: question.company_tag,
      category: question.category,
      crm_field: question.crm_field,
      answer: option.value,
      answer_label: optionValue === "outra" && value.includes(":")
        ? `Outra plataforma: ${value.slice(value.indexOf(":") + 1)}`
        : option.label,
      score_aktie: option.score_aktie,
      score_kompelys: option.score_kompelys,
      ...(option.dor ? { dor: option.dor } : {}),
    });
  }
  return records;
}

/** Leitura interna da operação, usada só pela equipe (nunca exibida no totem). */
function pickProfile(answers: Record<string, string>, scoreAktie: number, scoreKompelys: number): Profile {
  const semPlataforma = answers["Q01"] === "nenhuma";
  const querEvoluirModelo = answers["Q02"] === "evoluir";
  const modernizarTech = answers["Q03"] === "trocar" || answers["Q03"] === "automatizar";
  const integrarSistemas = answers["Q03"] === "integrar";
  const otimizarSo = answers["Q03"] === "otimizar";
  const gargaloCanais = answers["Q04"] === "canais";
  const gargaloComplexos = answers["Q04"] === "complexos";
  const gargaloVolume = answers["Q04"] === "recontato" || answers["Q04"] === "manual";

  if (semPlataforma && querEvoluirModelo) {
    return {
      slug: "operacao_no_esforco",
      titulo: "Operação sustentada no esforço",
      frase: "Sem plataforma e sem modelo definido: o time segura a régua na mão. Isso tem teto.",
    };
  }

  if (gargaloCanais && integrarSistemas) {
    return {
      slug: "crescendo_sem_previsibilidade",
      titulo: "Crescendo, mas sem previsibilidade",
      frase: "A operação acompanha o volume no improviso, não no desenho.",
    };
  }

  if (modernizarTech && (gargaloVolume || gargaloComplexos)) {
    return {
      slug: "atendimento_sem_resolucao",
      titulo: "Atendimento em movimento, resolução em aberto",
      frase: "Responder não é o mesmo que resolver.",
    };
  }

  if (otimizarSo && !gargaloComplexos && !gargaloVolume) {
    return {
      slug: "operacao_sob_controle",
      titulo: "Operação sob controle",
      frase: "Está redondo hoje. O jogo agora é manter isso enquanto cresce.",
    };
  }

  if (semPlataforma || querEvoluirModelo) {
    return {
      slug: "potencial_parado",
      titulo: "Potencial parado dentro da própria operação",
      frase: "A estrutura existe. O que falta é extrair resultado dela.",
    };
  }

  if (modernizarTech || integrarSistemas) {
    return {
      slug: "modelo_maduro_sem_escala",
      titulo: "Modelo maduro, ainda sem escala",
      frase: "A base está de pé. O próximo salto é crescer sem dobrar a estrutura.",
    };
  }

  if (scoreAktie + scoreKompelys <= 4) {
    return {
      slug: "operacao_sob_controle",
      titulo: "Operação sob controle",
      frase: "Está redondo hoje. O jogo agora é manter isso enquanto cresce.",
    };
  }

  return {
    slug: "atendimento_sem_resolucao",
    titulo: "Atendimento em movimento, resolução em aberto",
    frase: "Responder não é o mesmo que resolver.",
  };
}

export function buildReading(answers: Record<string, string>, cargoValue?: string): Reading {
  const respostas = buildAnswerRecords(answers);

  let score_aktie = 0;
  let score_kompelys = 0;
  let perguntas_aktie_respondidas = 0;
  let perguntas_kompelys_respondidas = 0;
  const dores: { dor: string; peso: number }[] = [];

  for (const r of respostas) {
    score_aktie += r.score_aktie;
    score_kompelys += r.score_kompelys;
    if (r.company_tag === "aktie" || r.company_tag === "both") perguntas_aktie_respondidas += 1;
    if (r.company_tag === "kompelys" || r.company_tag === "both") perguntas_kompelys_respondidas += 1;
    if (r.dor) dores.push({ dor: r.dor, peso: Math.max(r.score_aktie, r.score_kompelys) });
  }

  dores.sort((a, b) => b.peso - a.peso);

  // Fluxo enxuto (5 perguntas): máximos ~7 Aktie e ~6 Kompelys.
  const diff = Math.abs(score_aktie - score_kompelys);
  const both = score_aktie >= 4 && score_kompelys >= 4 && diff <= 2;

  let empresa_principal: Reading["empresa_principal"];
  let empresa_secundaria: Reading["empresa_secundaria"];
  if (both) {
    empresa_principal = "ambas";
    empresa_secundaria = "nenhuma";
  } else if (score_aktie >= score_kompelys) {
    empresa_principal = "aktie";
    empresa_secundaria = score_kompelys >= 3 ? "kompelys" : "nenhuma";
  } else {
    empresa_principal = "kompelys";
    empresa_secundaria = score_aktie >= 3 ? "aktie" : "nenhuma";
  }

  const cargoAuthority = CARGO_OPTIONS.find((c) => c.value === cargoValue)?.authority ?? 0;
  const authority = cargoAuthority;
  const total = score_aktie + score_kompelys;

  let qualificacao: Reading["qualificacao"] = "C";
  if (authority >= 3 && total >= 10) qualificacao = "A";
  else if (authority >= 2 && total >= 6) qualificacao = "B";

  return {
    score_aktie,
    score_kompelys,
    empresa_principal,
    empresa_secundaria,
    dor_principal: dores[0]?.dor ?? null,
    dor_secundaria: dores[1]?.dor ?? null,
    perguntas_aktie_respondidas,
    perguntas_kompelys_respondidas,
    qualificacao,
    perfil: pickProfile(answers, score_aktie, score_kompelys),
    respostas,
  };
}
