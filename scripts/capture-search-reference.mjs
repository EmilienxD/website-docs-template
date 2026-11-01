import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: "light" });
await page.goto("https://help.opus.pro/docs", { waitUntil: "domcontentloaded" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);
await page.getByRole("button", { name: "Open search", exact: true }).click();
const input = page.locator('[data-component-part="search-input"]');
await input.waitFor();
await page.waitForTimeout(300);
const save = name => page.screenshot({ path: `docs/design-references/opus-search-reference-${name}.png`, animations: "disabled" });
const measure = () => page.getByRole("dialog").evaluate(dialog => ({
  rect: dialog.getBoundingClientRect().toJSON(),
  input: document.querySelector("[role=combobox]").getBoundingClientRect().toJSON(),
  options: [...dialog.querySelectorAll("[role=option]")].map(element => ({ rect: element.getBoundingClientRect().toJSON(), title: element.querySelector("[data-component-part=search-item-title]")?.textContent })),
}));
await save("desktop-empty");
const evidence = { desktopEmpty: await measure() };
await input.fill("brand");
await page.getByRole("option").first().waitFor();
await page.waitForTimeout(300);
await save("desktop-results");
evidence.desktopResults = await measure();
await input.fill("qzxvbnmksjdhfgpq");
await page.waitForTimeout(900);
await save("desktop-no-results");
evidence.noResults = { ...await measure(), text: await page.getByRole("dialog").innerText() };
await page.keyboard.press("Escape");
await page.getByRole("dialog").waitFor({ state: "detached" });
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole("button", { name: "Open search", exact: true }).click();
await input.waitFor();
await page.waitForTimeout(300);
await save("mobile-empty");
evidence.mobileEmpty = await measure();
await input.fill("brand");
await page.getByRole("option").first().waitFor();
await page.waitForTimeout(300);
await save("mobile-results");
evidence.mobileResults = await measure();
await writeFile("docs/research/opus-help/search-reference.json", JSON.stringify(evidence, null, 2));
console.log(JSON.stringify({ desktopEmpty: evidence.desktopEmpty.rect, mobileEmpty: evidence.mobileEmpty.rect, noResults: evidence.noResults.text, icons: 8 }));
await browser.close();
