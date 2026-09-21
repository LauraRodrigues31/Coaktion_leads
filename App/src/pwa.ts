import { registerSW } from "virtual:pwa-register";

/**
 * Registra o service worker. Uma versão nova só é aplicada quando o totem
 * está parado na tela inicial (`isIdle()`), nunca no meio de um atendimento.
 */
export function setupPwa(isIdle: () => boolean) {
  let pendingApply: (() => void) | null = null;
  const update = registerSW({
    immediate: true,
    onNeedRefresh() {
      pendingApply = () => void update(true);
    },
  });
  setInterval(() => {
    if (pendingApply && isIdle()) {
      const apply = pendingApply;
      pendingApply = null;
      apply();
    }
  }, 5_000);
  // Pede ao Chrome para não apagar os leads guardados se faltar espaço.
  void navigator.storage?.persist?.();
}
