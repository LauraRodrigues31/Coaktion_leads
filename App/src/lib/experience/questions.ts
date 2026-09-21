/**
 * Banco de perguntas da experiência Coaktion (Conarec 2026).
 *
 * IMPORTANTE: `company_tag`, `score_aktie`, `score_kompelys`, `category` e
 * `crm_field` são metadados INTERNOS. Nada disso pode ser exibido ao visitante.
 * As perguntas vêm dos direcionais da Aktie Now e da Kompelys, apenas
 * reordenadas e intercaladas para parecerem uma única jornada Coaktion.
 *
 * Versão enxuta: 5 perguntas — jornada de 1 a 2 minutos,
 * mantendo o equilíbrio entre as duas marcas (2 Aktie, 2 Kompelys, 1 comum).
 */

export type CompanyTag = "aktie" | "kompelys" | "both";

export interface QuestionOption {
  value: string;
  label: string;
  icon: string;
  score_aktie: number;
  score_kompelys: number;
  dor?: string;
  /** peso extra de qualificação comercial (decisor, etc.) */
  authority?: number;
}

export interface Question {
  id: string;
  /** origem interna da pergunta */
  company_tag: CompanyTag;
  category: string;
  crm_field: string;
  text: string;
  options: QuestionOption[];
  /** microcopy exibida após a resposta */
  ack?: string;
}

export const QUESTIONS: Record<string, Question> = {
  Q01: {
    id: "Q01",
    company_tag: "aktie",
    category: "plataforma_atendimento",
    crm_field: "plataforma_atendimento",
    text: "Qual plataforma de atendimento ao cliente sua empresa usa?",
    ack: "Anotado.",
    options: [
      {
        value: "zendesk",
        label: "Zendesk",
        icon: "◎",
        score_aktie: 3,
        score_kompelys: 0,
      },
      {
        value: "salesforce",
        label: "Salesforce",
        icon: "◈",
        score_aktie: 2,
        score_kompelys: 0,
      },
      {
        value: "servicenow",
        label: "ServiceNow",
        icon: "◍",
        score_aktie: 2,
        score_kompelys: 0,
      },
      {
        value: "outra",
        label: "Outra plataforma",
        icon: "○",
        score_aktie: 1,
        score_kompelys: 0,
        dor: "plataforma de atendimento a revisar",
      },
    ],
  },
  Q02: {
    id: "Q02",
    company_tag: "kompelys",
    category: "modelo_atendimento",
    crm_field: "modelo_atendimento",
    text: "Como funciona o atendimento ao cliente na sua empresa?",
    ack: "Entendi.",
    options: [
      {
        value: "propria_bem",
        label: "Equipe própria",
        icon: "◎",
        score_aktie: 0,
        score_kompelys: 1,
      },
      {
        value: "bpo_bem",
        label: "Terceirizado (BPO)",
        icon: "◍",
        score_aktie: 0,
        score_kompelys: 3,
      },
      {
        value: "evoluir",
        label: "Queremos evoluir, seja equipe própria ou terceirizada",
        icon: "◈",
        score_aktie: 0,
        score_kompelys: 2,
        dor: "modelo de atendimento a evoluir",
      },
    ],
  },
  Q03: {
    id: "Q03",
    company_tag: "aktie",
    category: "evolucao_tecnologica",
    crm_field: "evolucao_tecnologica",
    text: "O que mais precisa evoluir por aí na tecnologia de atendimento?",
    ack: "Perfeito.",
    options: [
      {
        value: "trocar",
        label: "Trocar de plataforma",
        icon: "◈",
        score_aktie: 3,
        score_kompelys: 0,
        dor: "necessidade de troca de plataforma",
      },
      {
        value: "automatizar",
        label: "Automatizar com IA",
        icon: "◍",
        score_aktie: 3,
        score_kompelys: 0,
        dor: "necessidade de automação com IA",
      },
      {
        value: "integrar",
        label: "Integrar com outros sistemas (CRM, ERP, e-commerce)",
        icon: "◊",
        score_aktie: 2,
        score_kompelys: 0,
        dor: "sistemas desconectados",
      },
      {
        value: "otimizar",
        label: "Só otimizar o que já temos",
        icon: "◎",
        score_aktie: 0,
        score_kompelys: 0,
      },
    ],
  },
  Q04: {
    id: "Q04",
    company_tag: "kompelys",
    category: "gargalo",
    crm_field: "gargalo_principal",
    text: "Onde o atendimento mais trava hoje?",
    ack: "É isso.",
    options: [
      {
        value: "recontato",
        label: "Recontato por falta de resolução",
        icon: "◍",
        score_aktie: 1,
        score_kompelys: 2,
        dor: "recontato por falta de resolução",
      },
      {
        value: "complexos",
        label: "Casos complexos que exigem decisão",
        icon: "○",
        score_aktie: 1,
        score_kompelys: 3,
        dor: "casos complexos sem resolução",
      },
      {
        value: "canais",
        label: "Alto volume de canais desconectados",
        icon: "◊",
        score_aktie: 1,
        score_kompelys: 2,
        dor: "alto volume de canais desconectados",
      },
      {
        value: "manual",
        label: "Excesso de trabalho manual",
        icon: "◎",
        score_aktie: 1,
        score_kompelys: 2,
        dor: "excesso de trabalho manual",
      },
    ],
  },
  Q05: {
    id: "Q05",
    company_tag: "both",
    category: "perfil_empresa",
    crm_field: "tamanho_empresa",
    text: "Qual o tamanho aproximado da sua empresa?",
    ack: "Boa.",
    options: [
      {
        value: "1_a_49",
        label: "De 1 a 49 funcionários",
        icon: "◎",
        score_aktie: 0,
        score_kompelys: 0,
      },
      {
        value: "50_a_249",
        label: "De 50 a 249 funcionários",
        icon: "◈",
        score_aktie: 0,
        score_kompelys: 0,
      },
      {
        value: "250_a_999",
        label: "De 250 a 999 funcionários",
        icon: "◍",
        score_aktie: 0,
        score_kompelys: 0,
      },
      {
        value: "mais_1000",
        label: "Mais de 1.000 funcionários",
        icon: "○",
        score_aktie: 0,
        score_kompelys: 0,
      },
    ],
  },
};

/** Opções de cargo, coletadas por toque (sem digitação). */
export const CARGO_OPTIONS = [
  { value: "c_level", label: "C-level / Diretoria", authority: 3 },
  { value: "gerencia", label: "Gerência", authority: 3 },
  { value: "coordenacao", label: "Coordenação / Supervisão", authority: 2 },
  { value: "especialista", label: "Especialista / Analista", authority: 1 },
];

export type Step =
  | { kind: "welcome" }
  | { kind: "intro" }
  | { kind: "question"; questionId: string }
  | { kind: "text"; field: "nome" | "empresa"; title: string; placeholder: string; inputType: "text" }
  | { kind: "cargo" }
  | { kind: "contato" }
  | { kind: "consent" }

  | { kind: "ticket" };

/**
 * Jornada única e curta: perguntas das duas empresas intercaladas e coleta de
 * dados distribuída. E-mail corporativo e WhatsApp ficam juntos, na etapa final
 * de contato, seguidos do consentimento e do vale do mimo.
 */
export const FLOW: Step[] = [
  { kind: "welcome" },
  { kind: "text", field: "nome", title: "Como podemos te chamar?", placeholder: "Seu nome", inputType: "text" },
  { kind: "intro" },
  { kind: "question", questionId: "Q01" },
  { kind: "question", questionId: "Q02" },
  { kind: "text", field: "empresa", title: "Qual empresa você representa?", placeholder: "Nome da empresa", inputType: "text" },
  { kind: "question", questionId: "Q03" },
  { kind: "cargo" },
  { kind: "question", questionId: "Q04" },
  { kind: "question", questionId: "Q05" },
  { kind: "contato" },

  { kind: "consent" },
  { kind: "ticket" },
];

/**
 * Lógica adaptativa: nesta versão enxuta não há pulo de etapas.
 * A função continua existindo para manter a API compatível com a interface.
 */
export function shouldSkip(_step: Step, _answers: Record<string, string>): boolean {
  return false;
}
