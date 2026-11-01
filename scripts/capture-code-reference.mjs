import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: "light" });
const evidence = {};
for (const [name, url] of [
  ["opus", "https://help.opus.pro/api-reference/endpoints/create-project"],
  ["forma", "http://localhost:3000/docs/article/api-overview"],
]) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  evidence[name] = { url, states: {} };
  const save = async (state, selector) => {
    const block = page.locator(selector).first();
    await block.scrollIntoViewIfNeeded();
    await block.screenshot({ path: `docs/design-references/${name}-code-${state}.png`, animations: "disabled" });
    evidence[name].states[state] = await block.evaluate(element => {
      const pre = element.querySelector("pre");
      const css = getComputedStyle(pre);
      return { width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height, fontFamily: css.fontFamily, fontSize: css.fontSize, fontWeight: css.fontWeight, lineHeight: css.lineHeight, background: css.backgroundColor, radius: getComputedStyle(element).borderRadius, viewport: [innerWidth, innerHeight] };
    });
  };
  await save("desktop-plain", ".code-block");
  await save("desktop-tabs", ".code-group");
  await page.locator('.code-group [role="tab"]').nth(1).click();
  await save("desktop-alternate-tab", ".code-group");
  await page.setViewportSize({ width: 390, height: 844 });
  await save("mobile-tabs", ".code-group");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await save("dark-tabs", ".code-group");
  await page.close();
}
await writeFile("docs/research/opus-help/code-block-measurements.json", JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
await browser.close();
