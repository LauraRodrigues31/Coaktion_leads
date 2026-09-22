// Qual layout mostrar (?layout=... na URL). PADRÃO (sem parâmetro, e portanto
// o que o app instalado abre) = "centro": pedido da gerente de marketing,
// aprovado em 2026-09-22 — tudo centralizado na tela. "atual" força o layout
// de hoje (o do Lovable, sem nenhuma mudança), só pra comparação. "proposta" =
// sugestão da pesquisa de ergonomia (conteúdo na zona de toque, 90–120 cm).
const layoutParam = new URLSearchParams(location.search).get("layout");
export const PROPOSTA = layoutParam === "proposta";
export const CENTRO = layoutParam === "centro" || layoutParam === null;
export const LAYOUT_LABEL = CENTRO ? "CENTRALIZADO" : PROPOSTA ? "PROPOSTA (pesquisa)" : "ATUAL (Lovable)";

// No Android, segurar o dedo abre o menu do Chrome (copiar, inspecionar...) e
// cancela o toque; este estilo desliga esse menu e a seleção nos botões da equipe.
export const STAFF_BUTTON_STYLE = {
  touchAction: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none",
} as const;
