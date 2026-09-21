// Versão de teste com a proposta de ergonomia (?layout=proposta): só reposiciona
// (conteúdo desce para a zona de toque, "Voltar" desce e cresce, logo sobe).
// Medidas em % da altura da tela, tiradas da simulação em 1080×1920.
export const PROPOSTA = new URLSearchParams(location.search).get("layout") === "proposta";
