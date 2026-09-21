// Gera capturas de tela do app para o guia do totem. Uso: OUT=<dir> node scripts/shots.mjs (com vite preview na 4173)
import { chromium } from "playwright-core";
const OUT = process.env.OUT;
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
const page = await ctx.newPage();
const ring = (side, label) => page.evaluate(([side, label]) => {
  const d = document.createElement("div");
  d.style.cssText = `position:fixed;bottom:0;${side}:0;width:150px;height:150px;border:8px solid #ff2d55;border-radius:50%;z-index:99999;pointer-events:none`;
  const t = document.createElement("div");
  t.textContent = label;
  t.style.cssText = `position:fixed;bottom:170px;${side}:20px;background:#ff2d55;color:#fff;font:700 34px sans-serif;padding:10px 18px;border-radius:14px;z-index:99999;max-width:420px`;
  document.body.append(d, t);
}, [side, label]);

await page.goto("file:///home/inteli/Documentos/repos/Coaktion_leads/Docs/static/teste-totem.html");
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/teste.png` });

await page.goto("http://localhost:4173/?totem=1");
await page.waitForSelector("text=Toque na tela");
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/welcome-plain.png` });
await ring("left", "Segurar 1,5 s aqui");
await page.screenshot({ path: `${OUT}/welcome-ring.png` });
await page.reload();

async function flow(name) {
  await page.getByRole("button", { name: /Toque na tela/ }).click();
  page.setDefaultTimeout(1500);
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(350);
    try {
      if (await page.getByText("Obrigado por fazer seu pedido").count()) return;
      const input = page.locator("input:visible:not([type=checkbox])");
      const n = await input.count();
      for (let k = 0; k < n; k++) {
        const el = input.nth(k);
        if (await el.inputValue()) continue;
        const t = (await el.getAttribute("type")) ?? "text";
        await el.fill(t === "email" ? "teste@empresa.com" : t === "tel" ? "11999998888" : k === 0 && i < 3 ? name : "Empresa Teste");
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
}
await flow("Teste 1");
await page.getByRole("button", { name: "Encerrar" }).click();
await flow("Teste 2");
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/final.png` });
await page.getByRole("button", { name: "Encerrar" }).click();
await page.waitForTimeout(400);
const box = await page.getByLabel("Painel da equipe").boundingBox();
await page.mouse.move(box.x + 5, box.y + 5);
await page.mouse.down(); await page.waitForTimeout(1800); await page.mouse.up();
await page.getByText(/2 lead\(s\)/).waitFor();
await page.screenshot({ path: `${OUT}/painel.png` });
await browser.close();
