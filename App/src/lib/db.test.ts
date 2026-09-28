import { describe, expect, it } from "vitest";
import { TotemDB, saveLeadLocal, type LeadPayload } from "./db";
import { leadsToCsv, CSV_COLUMNS } from "./csv";

const payload = (nome: string): LeadPayload => ({
  nome, empresa: 'Acme, "Ltda"', cargo: null, email: "a@b.co", telefone: "11999999999",
  consent: true, mimos: [], score_aktie: 3, score_kompelys: 1,
  empresa_principal: "aktie", empresa_secundaria: null, dor_principal: null, dor_secundaria: null,
  perguntas_aktie_respondidas: 2, perguntas_kompelys_respondidas: 1, qualificacao: "quente",
  perfil_slug: "x", perfil_titulo: "X",
  respostas: [
    { question_id: "Q01", question_text: "Qual plataforma?", company_tag: "aktie", category: "c1", crm_field: "f1", answer: "zendesk", answer_label: "Zendesk", score_aktie: 3, score_kompelys: 0 },
    { question_id: "Q03", question_text: "O que evoluir?", company_tag: "aktie", category: "c3", crm_field: "f3", answer: "trocar", answer_label: "Trocar de plataforma", score_aktie: 3, score_kompelys: 0 },
  ],
});

describe("offline lead storage", () => {
  it("gera códigos únicos por totem e exporta CSV válido", async () => {
    const d = new TotemDB("test-" + Math.random());
    const a = await saveLeadLocal(payload("Ana"), "totem-1", d);
    const b = await saveLeadLocal(payload("=Bob"), "totem-1", d);
    const c = await saveLeadLocal(payload("Cy"), "totem-2", d);
    expect(a.ticket_code).toBe("CAK-T1-0001");
    expect(b.ticket_code).toBe("CAK-T1-0002");
    expect(c.ticket_code).toBe("CAK-T2-0003");
    const csv = leadsToCsv(await d.leads.toArray());
    const lines = csv.trim().split("\r\n");
    expect(lines).toHaveLength(4);
    expect(lines[0].replace("﻿", "").split(",")).toEqual([...CSV_COLUMNS]);
    expect(csv).toContain('"Acme, ""Ltda"""');
    expect(csv).toContain("'=Bob");
    // respostas é jsonb (lista de objetos), não text[] (lista de strings como
    // mimos) — regressão real: virava literalmente "[object Object]" no CSV.
    expect(csv).not.toContain("[object Object]");
    expect(csv).toContain('""question_id"":""Q01""');
    // Colunas desmembradas por pergunta: legíveis, sem precisar ler o JSON.
    const header = lines[0].replace("﻿", "").split(",");
    expect(header).toContain("Q01_resposta");
    expect(header).toContain("Q03_resposta");
    expect(csv).toContain("Zendesk"); // Q01_resposta
    expect(csv).toContain("Trocar de plataforma"); // Q03_resposta
    // Q02, Q04, Q05 não foram respondidas neste lead: coluna vazia, não erro.
    const row1 = lines[1].split(",");
    const q02Idx = header.indexOf("Q02_resposta");
    expect(row1[q02Idx]).toBe("");
  });
  it("rejeita lead sem nome", async () => {
    await expect(saveLeadLocal(payload(" "), "totem-1", new TotemDB("t2-" + Math.random()))).rejects.toThrow();
  });
});
