import { chromium } from "playwright-core";
const dir = "/tmp/claude-1000/-home-inteli-Documentos-repos-Coaktion-leads/c1a68b0d-eb3d-474b-9027-7e83d6db7a5d/scratchpad/chrome-profile";
const ctx = await chromium.launchPersistentContext(dir, {
  executablePath: "/usr/bin/google-chrome", headless: false,
  viewport: { width: 412, height: 915 },
  args: ["--headless=new", "--no-sandbox"],
});
const p = ctx.pages()[0] ?? await ctx.newPage();
await p.goto("https://laurarodrigues31.github.io/Coaktion_leads/app/?totem=1");
await p.evaluate(() => navigator.serviceWorker.ready);
await p.waitForTimeout(2500);
const c = await ctx.newCDPSession(p);
console.log("installability:", JSON.stringify(await c.send("Page.getInstallabilityErrors")));
const sw = await p.evaluate(async () => {
  const regs = await navigator.serviceWorker.getRegistrations();
  return regs.map(r => ({ scope: r.scope, active: !!r.active, state: r.active?.state }));
});
console.log("sw:", JSON.stringify(sw));
await ctx.close();
