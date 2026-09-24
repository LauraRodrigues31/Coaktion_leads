import { describe, expect, it } from "vitest";
import { TotemDB, saveLeadLocal, type LeadPayload } from "./db";
import { leadsToCsv, CSV_COLUMNS } from "./csv";

const payload = (nome: string): LeadPayload => ({
  nome, empresa: 'Acme, "Ltda"', cargo: null, email: "a@b.co", telefone: "11999999999",
  consent: true, mimos: [], score_aktie: 3, score_kompelys: 1,
  empresa_principal: "aktie", empresa_secundaria: null, dor_principal: null, dor_secundaria: null,
  perguntas_aktie_respondidas: 2, perguntas_kompelys_respondidas: 1, qualificacao: "quente",
  perfil_slug: "x", perfil_titulo: "X", respostas: [{ q: "Q1", a: "sim" }],
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
    expect(csv).toContain('[{""q"":""Q1"",""a"":""sim""}]');
  });
  it("rejeita lead sem nome", async () => {
    await expect(saveLeadLocal(payload(" "), "totem-1", new TotemDB("t2-" + Math.random()))).rejects.toThrow();
  });
});
