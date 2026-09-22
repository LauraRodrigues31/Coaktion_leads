import { registerSW } from "virtual:pwa-register";

/**
 * Registra o service worker. Com registerType "autoUpdate" (vite.config.ts),
 * uma versão nova é aplicada assim que detectada — só acontece com internet,
 * então em operação normal (offline) nunca troca no meio de um atendimento.
 */
export function setupPwa() {
  registerSW({ immediate: true });
  // Pede ao Chrome para não apagar os leads guardados se faltar espaço.
  void navigator.storage?.persist?.();
}
