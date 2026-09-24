import type { LeadRecord } from "./db";

// Mesma ordem/nomes das colunas da tabela `leads` do Supabase (+ totem_id),
// para importar direto pelo Supabase Studio ou abrir no Excel.
export const CSV_COLUMNS = [
  "id",
  "evento",
  "origem",
  "campanha",
  "totem_id",
  "ticket_code",
  "ticket_status",
  "created_at",
  "nome",
  "empresa",
  "cargo",
  "email",
  "telefone",
  "consent",
  "mimos",
  "score_aktie",
  "score_kompelys",
  "empresa_principal",
  "empresa_secundaria",
  "dor_principal",
  "dor_secundaria",
  "perguntas_aktie_respondidas",
  "perguntas_kompelys_respondidas",
  "qualificacao",
  "perfil_slug",
  "perfil_titulo",
  "respostas",
] as const;

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s: string;
  // text[] do Postgres (ex.: mimos) só quando é uma lista de valores simples.
  // Uma lista de objetos (ex.: respostas, cada uma com pergunta/rótulo/pontuação)
  // é jsonb, não text[] — precisa virar JSON de verdade, nunca "[object Object]".
  const isSimpleArray = Array.isArray(value) && value.every((v) => v === null || typeof v !== "object");
  if (isSimpleArray) s = `{${(value as unknown[]).map((v) => `"${String(v).replace(/(["\\])/g, "\\$1")}"`).join(",")}}`;
  else if (typeof value === "object") s = JSON.stringify(value);
  else s = String(value);
  // Neutraliza fórmulas de planilha (=, +, -, @) em texto digitado pelo visitante.
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function leadsToCsv(leads: LeadRecord[]): string {
  const rows = leads.map((l) => {
    const full: Record<string, unknown> = {
      evento: "Conarec 2026",
      origem: "totem_estande",
      campanha: "coaktion_experiencia_2026",
      ...l,
    };
    return CSV_COLUMNS.map((c) => cell(full[c])).join(",");
  });
  // BOM para o Excel abrir acentos corretamente.
  return "\uFEFF" + [CSV_COLUMNS.join(","), ...rows].join("\r\n") + "\r\n";
}

export function csvFileName(totemId: string, now = new Date()) {
  const d = now.toISOString().slice(0, 10);
  const t = now.toTimeString().slice(0, 5).replace(":", "h");
  return `leads_${totemId}_${d}_${t}.csv`;
}

export function downloadCsv(csv: string, filename: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
