import { useEffect, useRef, useState } from "react";

import { csvFileName, downloadCsv, leadsToCsv } from "@/lib/csv";
import { countLeads, db } from "@/lib/db";
import { PROPOSTA } from "@/lib/layout";
import { setTotemId as saveTotemId, TOTEM_IDS, type TotemId } from "@/lib/totemId";

/** Primeira abertura: a equipe escolhe se este aparelho é o Totem 1 ou o Totem 2. */
export function TotemSetup({ onChoose }: { onChoose: (id: TotemId) => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <h1 className="text-3xl font-bold">Configuração do totem</h1>
      <p className="text-lg text-muted-foreground">Este aparelho é qual totem? (só a equipe faz isso, uma vez)</p>
      {TOTEM_IDS.map((id, i) => (
        <button
          key={id}
          onClick={() => {
            saveTotemId(id);
            onChoose(id);
          }}
          className="action-gradient w-full max-w-md rounded-full px-8 py-5 text-2xl font-bold text-primary-foreground"
        >
          Totem {i + 1}
        </button>
      ))}
    </main>
  );
}

/** Botão discreto (canto inferior esquerdo): segure 1,5s para abrir o painel da equipe. */
export function StaffPanel({
  totemId,
  onTotemChange,
}: {
  totemId: TotemId;
  onTotemChange: (id: TotemId | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) void countLeads().then(setCount);
  }, [open]);

  const start = () => {
    setArmed(true);
    timer.current = setTimeout(() => {
      setArmed(false);
      setOpen(true);
    }, 1500);
  };
  const cancel = () => {
    setArmed(false);
    if (timer.current) clearTimeout(timer.current);
  };

  const exportCsv = async () => {
    const leads = await db.leads.orderBy("seq").toArray();
    downloadCsv(leadsToCsv(leads), csvFileName(totemId));
    setMsg(`Arquivo com ${leads.length} lead(s) salvo em Downloads.`);
  };

  return (
    <>
      <button
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        aria-label="Painel da equipe"
        className={`fixed bottom-3 left-3 h-10 w-10 rounded-full transition-colors ${armed ? "bg-accent/70" : "bg-white/10"}`}
      />
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-background p-6 text-center">
            <h3 className="text-2xl font-bold">Painel da equipe</h3>
            <p className="text-muted-foreground">
              {totemId.replace("-", " ")} · {count ?? "…"} lead(s) salvos neste aparelho
            </p>
            <p className="text-sm text-muted-foreground">Layout: {PROPOSTA ? "PROPOSTA (pesquisa)" : "ATUAL (Lovable)"}</p>
            <button
              onClick={() => void exportCsv()}
              className="action-gradient w-full rounded-full px-8 py-4 text-xl font-bold text-primary-foreground"
            >
              Exportar CSV
            </button>
            {msg && <p className="text-primary">{msg}</p>}
            <button
              onClick={() => {
                if (confirm("Trocar a identificação deste totem?")) {
                  localStorage.removeItem("coaktion.totem_id");
                  onTotemChange(null);
                }
              }}
              className="w-full text-sm text-muted-foreground underline"
            >
              Trocar identificação do totem
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setMsg(null);
              }}
              className="w-full rounded-full bg-primary px-8 py-3 text-lg font-bold text-primary-foreground"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
