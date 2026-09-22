// Qual layout mostrar (?layout=... na URL). Sem parâmetro = ATUAL (o do Lovable,
// sem nenhuma mudança). "proposta" = sugestão da pesquisa de ergonomia (conteúdo
// na zona de toque, 90–120 cm). "centro" = pedido da gerente de marketing: tudo
// centralizado na tela, sem seguir a faixa de toque nem ficar no topo.
const layoutParam = new URLSearchParams(location.search).get("layout");
export const PROPOSTA = layoutParam === "proposta";
export const CENTRO = layoutParam === "centro";
export const LAYOUT_LABEL = CENTRO ? "CENTRALIZADO" : PROPOSTA ? "PROPOSTA (pesquisa)" : "ATUAL (Lovable)";

// No Android, segurar o dedo abre o menu do Chrome (copiar, inspecionar...) e
// cancela o toque; este estilo desliga esse menu e a seleção nos botões da equipe.
export const STAFF_BUTTON_STYLE = {
  touchAction: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none",
} as const;
