// Simula o toque de dedo segurado 1,8 s (celular) nos dois botões da equipe.
import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const c = await ctx.newCDPSession(p);
let ctxMenuPrevented = false;
await p.goto(process.env.APP_URL ?? "http://localhost:4173/?totem=1");
await p.waitForSelector("text=Toque na tela");
await p.evaluate(() => document.addEventListener("contextmenu", (e) => (window.__cm = e.defaultPrevented)));
async function hold(label, x, y) {
  await c.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await p.waitForTimeout(1800);
  await c.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await p.waitForTimeout(300);
}
await hold("painel", 25, 1895);
console.log(await p.getByText(/lead\(s\)/).count() ? "✓ painel abriu com toque segurado" : "✗ painel NÃO abriu");
await b.close();
