// Identificação fixa de cada totem (1 ou 2). Definida na primeira abertura
// (ou via ?totem=1 na URL) e guardada no aparelho.
const KEY = "coaktion.totem_id";

export const TOTEM_IDS = ["totem-1", "totem-2"] as const;
export type TotemId = (typeof TOTEM_IDS)[number];

export function getTotemId(): TotemId | null {
  try {
    const fromUrl = new URLSearchParams(location.search).get("totem");
    if (fromUrl && /^[12]$/.test(fromUrl)) setTotemId(`totem-${fromUrl}` as TotemId);
    const v = localStorage.getItem(KEY);
    return (TOTEM_IDS as readonly string[]).includes(v ?? "") ? (v as TotemId) : null;
  } catch {
    return null;
  }
}

export function setTotemId(id: TotemId) {
  localStorage.setItem(KEY, id);
}
