import { chromium } from "playwright-core";
const OUT = process.env.OUT;
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.setDefaultTimeout(1500);
await page.goto("https://laurarodrigues31.github.io/Coaktion_leads/app/?totem=1", { timeout: 15000 });
await page.waitForSelector("text=Toque na tela");
await page.screenshot({ path: `${OUT}/live-welcome.png` });
await page.getByRole("button", { name: /Toque na tela/ }).click();
for (let i = 0; i < 6; i++) {
  await page.waitForTimeout(500);
  try {
    const input = page.locator("input:visible:not([type=checkbox])");
    if (await input.count()) { await input.first().fill("Teste"); const b=page.getByRole("button",{name:/^(Continuar|Avançar)/}); if(await b.count()&&await b.first().isEnabled()){await b.first().click(); continue;} }
    await page.evaluate(() => { const b=[...document.querySelectorAll("main button")].find(x=>!x.getAttribute("aria-label")&&!x.disabled&&!/Política|Encerrar/.test(x.textContent)); b?.click(); });
  } catch {}
}
await page.screenshot({ path: `${OUT}/live-pergunta.png` });
await browser.close();
