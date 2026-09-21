// Teste ponta a ponta no Chrome real: instala, vai offline, recarrega, preenche o
// formulário, exporta o CSV. Uso: npm run build && npx vite preview --port 4173 & node scripts/e2e.mjs
import { chromium } from "playwright-core";
import fs from "node:fs";

const URL = process.env.APP_URL ?? "http://localhost:4173/";
const OUT = process.env.OUT ?? "/tmp/e2e";
fs.mkdirSync(OUT, { recursive: true });
const ok = (m) => console.log("✓", m);
const fail = (m) => { console.error("✗", m); process.exitCode = 1; };

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(URL + "?totem=1");
await page.evaluate(() => navigator.serviceWorker.ready);
await page.waitForTimeout(1500);
ok("service worker ativo");

await ctx.setOffline(true);
await page.reload();
await page.waitForSelector("text=Toque na tela", { timeout: 8000 }).then(() => ok("recarregou SEM rede"), () => fail("não abriu offline"));
await page.screenshot({ path: `${OUT}/1-welcome.png` });

async function fillFlow(name) {
  await page.getByRole("button", { name: /Toque na tela/ }).click();
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(350);
    try {
    if (await page.getByText("Obrigado por fazer seu pedido").count()) return true;
    const input = page.locator("input:visible:not([type=checkbox])");
    page.setDefaultTimeout(1500);
    const n = await input.count();
    for (let k = 0; k < n; k++) {
      const el = input.nth(k);
      if (await el.inputValue()) continue;
      const t = (await el.getAttribute("type")) ?? "text";
      await el.fill(t === "email" ? "teste@empresa.com" : t === "tel" ? "11999998888" : k === 0 && i < 3 ? name : "Empresa, \"X\"");
    }
    const consent = page.getByRole("button", { name: "Concordar com o uso dos dados" });
    if (await consent.count()) {
      await consent.click();
      await page.getByRole("button", { name: /vouchers/ }).click();
      continue;
    }
    const next = page.getByRole("button", { name: /^(Continuar|Avançar)/ });
    if (await next.count() && await next.first().isEnabled()) { await next.first().click(); continue; }
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("main button")].find((x) => !x.getAttribute("aria-label") && !x.disabled && !/Política|Encerrar/.test(x.textContent));
      b?.click();
    });
    } catch { /* transição de tela: tenta de novo */ }
  }
  return false;
}

for (const name of ["Ana Teste", "=Bob"]) {
  const done = await fillFlow(name);
  done ? ok(`fluxo completo (${name}) até a tela final`) : fail(`fluxo travou (${name})`);
  await page.screenshot({ path: `${OUT}/2-final-${name[0]}.png` });
  await page.getByRole("button", { name: "Encerrar" }).click();
}

// painel da equipe: segurar 1,5s no botão esquerdo
const staff = page.getByLabel("Painel da equipe");
const box = await staff.boundingBox();
await page.mouse.move(box.x + 5, box.y + 5);
await page.mouse.down();
await page.waitForTimeout(1800);
await page.mouse.up();
await page.screenshot({ path: `${OUT}/3-painel.png` });
await page.getByText(/2 lead\(s\)/).waitFor({ timeout: 3000 }).then(() => ok("painel mostra 2 leads"), () => fail("contagem errada"));
const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Exportar CSV" }).click()]);
const path = `${OUT}/${dl.suggestedFilename()}`;
await dl.saveAs(path);
const csv = fs.readFileSync(path, "utf8");
console.log(dl.suggestedFilename());
csv.includes("CAK-T1-0001") && csv.includes("CAK-T1-0002") ? ok("CSV com 2 leads e códigos únicos") : fail("CSV inesperado");
errors.length ? fail("erros de página: " + errors.join(" | ")) : ok("sem erros no console");
await browser.close();
