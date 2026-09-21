import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath } from "node:url";

// BASE_PATH: no GitHub Pages o app fica em /Coaktion_leads/app/; no totem final pode ser "/".
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // "prompt" evita trocar a tela no meio de um atendimento; a atualização
      // é aplicada por src/pwa.ts quando o totem está na tela inicial.
      registerType: "prompt",
      injectRegister: false,
      manifest: {
        name: "Coaktion · Conarec 2026",
        short_name: "Coaktion",
        lang: "pt-BR",
        display: "standalone",
        orientation: "portrait",
        start_url: base,
        scope: base,
        background_color: "#0b0a10",
        theme_color: "#0b0a10",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Tudo que o app usa (JS, CSS, fontes, imagens, PDF) entra no pré-cache.
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2,pdf,webmanifest}"],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: { environment: "node", setupFiles: ["./src/test-setup.ts"] },
});
