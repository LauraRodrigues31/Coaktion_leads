// Capturas lado a lado: layout atual x proposta. Uso: OUT=<dir> node scripts/shots-layout.mjs (com vite preview na 4173)
import { chromium } from "playwright-core";
const OUT = process.env.OUT;
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
for (const layout of ["atual", "proposta"]) {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
  const page = await ctx.newPage();
  page.setDefaultTimeout(1500);
  await page.goto(`http://localhost:4173/?totem=1${layout === "proposta" ? "&layout=proposta" : ""}`);
  await page.waitForSelector("text=Toque na tela");
  await page.getByRole("button", { name: /Toque na tela/ }).click();
  const seen = new Set();
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(450);
    try {
      const key = await page.evaluate(() => document.querySelector("main h2")?.textContent ?? "");
      if (key && !seen.has(key)) { seen.add(key); await page.screenshot({ path: `${OUT}/${layout}-${String(seen.size).padStart(2, "0")}.png` }); }
      if (await page.getByText("Obrigado por fazer seu pedido").count()) break;
      const input = page.locator("input:visible:not([type=checkbox])");
      const n = await input.count();
      for (let k = 0; k < n; k++) {
        const el = input.nth(k);
        if (await el.inputValue()) continue;
        const t = (await el.getAttribute("type")) ?? "text";
        await el.fill(t === "email" ? "teste@empresa.com" : t === "tel" ? "11999998888" : "Teste");
      }
      const consent = page.getByRole("button", { name: "Concordar com o uso dos dados" });
      if (await consent.count()) { await consent.click(); await page.getByRole("button", { name: /vouchers/ }).click(); continue; }
      const next = page.getByRole("button", { name: /^(Continuar|Avançar)/ });
      if (await next.count() && await next.first().isEnabled()) { await next.first().click(); continue; }
      await page.evaluate(() => {
        const b = [...document.querySelectorAll("main button")].find((x) => !x.getAttribute("aria-label") && !x.disabled && !/Política|Encerrar/.test(x.textContent));
        b?.click();
      });
    } catch {}
  }
  await ctx.close();
}
await browser.close();
