// Confere qual layout cada endereço abre de fato (label do painel da equipe).
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
for (const [label, qs] of [["sem parâmetro (padrão)", ""], ["atual", "&layout=atual"], ["proposta", "&layout=proposta"], ["centro", "&layout=centro"]]) {
  const page = await ctx.newPage();
  page.setDefaultTimeout(1500);
  await page.goto(`http://localhost:4173/?totem=1${qs}`);
  await page.waitForSelector("text=Toque na tela");
  const box = await page.getByLabel("Painel da equipe").boundingBox();
  await page.mouse.move(box.x + 5, box.y + 5);
  await page.mouse.down(); await page.waitForTimeout(1800); await page.mouse.up();
  const txt = await page.getByText(/Layout:/).textContent();
  console.log(label, "->", txt);
  await page.close();
}
await browser.close();
