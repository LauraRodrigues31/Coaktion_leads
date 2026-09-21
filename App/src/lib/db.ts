import Dexie, { type Table } from "dexie";

/** Um lead capturado no totem. Colunas equivalentes à tabela `leads` do Supabase + totem_id. */
export interface LeadRecord {
  seq?: number; // autoincremento local (nunca reaproveitado)
  id: string; // uuid, vira o `id` da tabela leads na importação
  totem_id: string;
  ticket_code: string;
  ticket_status: string;
  created_at: string;
  nome: string;
  empresa: string | null;
  cargo: string | null;
  email: string | null;
  telefone: string | null;
  consent: boolean;
  mimos: string[];
  score_aktie: number;
  score_kompelys: number;
  empresa_principal: string | null;
  empresa_secundaria: string | null;
  dor_principal: string | null;
  dor_secundaria: string | null;
  perguntas_aktie_respondidas: number;
  perguntas_kompelys_respondidas: number;
  qualificacao: string | null;
  perfil_slug: string | null;
  perfil_titulo: string | null;
  respostas: unknown;
}

export type LeadPayload = Omit<
  LeadRecord,
  "seq" | "id" | "totem_id" | "ticket_code" | "ticket_status" | "created_at"
>;

class TotemDB extends Dexie {
  leads!: Table<LeadRecord, number>;
  constructor(name = "coaktion-totem") {
    super(name);
    this.version(1).stores({ leads: "++seq, id, ticket_code, totem_id, created_at" });
  }
}

export const db = new TotemDB();

/** Código do voucher: CAK-<totem>-<sequência local>, ex. CAK-T1-0042. Não colide entre totens. */
export function makeTicketCode(totemId: string, seq: number) {
  const n = totemId.replace(/\D/g, "") || "0";
  return `CAK-T${n}-${String(seq).padStart(4, "0")}`;
}

/**
 * Equivalente local do `submit_experience` do Supabase: grava o lead no
 * IndexedDB e devolve `{ ticket_code }`, o mesmo contrato que a UI já espera.
 */
export async function saveLeadLocal(
  payload: LeadPayload,
  totemId: string,
  database: TotemDB = db,
): Promise<{ ticket_code: string }> {
  if (!payload.nome || payload.nome.trim() === "") throw new Error("nome obrigatorio");
  const base: LeadRecord = {
    ...payload,
    nome: payload.nome.slice(0, 120),
    id: crypto.randomUUID(),
    totem_id: totemId,
    ticket_code: "",
    ticket_status: "pendente",
    created_at: new Date().toISOString(),
  };
  return database.transaction("rw", database.leads, async () => {
    const seq = await database.leads.add(base);
    const ticket_code = makeTicketCode(totemId, seq);
    await database.leads.update(seq, { ticket_code });
    return { ticket_code };
  });
}

export async function countLeads(database: TotemDB = db) {
  return database.leads.count();
}

export { TotemDB };
