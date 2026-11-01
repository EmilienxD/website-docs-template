import { chromium } from "playwright";
import { mkdir, readdir, writeFile } from "node:fs/promises";

const referenceDir = new URL("../docs/design-references/", import.meta.url);
const researchDir = new URL("../docs/research/opus-help/", import.meta.url);
await mkdir(referenceDir, { recursive: true });
await mkdir(researchDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, colorScheme: "light" });
const page = await context.newPage();
const requests = new Set();
page.on("request", (request) => {
  if (["font", "image", "stylesheet", "media"].includes(request.resourceType())) requests.add(request.url());
});
const save = async (name, fullPage = false) => page.screenshot({ path: new URL(name, referenceDir).pathname.replace(/^\/(\w:)/, "$1"), fullPage });
await page.goto("https://help.opus.pro/docs", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByRole("heading", { name: "Introduction to OpusClip", exact: true }).waitFor();
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1600);
await save("opus-source-desktop-1440x1000-top.png");
const evidence = { source: "https://help.opus.pro/docs", resolved: page.url(), views: {} };
const measure = () => page.evaluate(() => {
  const selectors = ["body", "#navbar", "#sidebar", "#sidebar h3", "#sidebar a", "#content-container", "#content-area", "#page-title", "#table-of-contents", "#header", ".card", ".card h2", ".mdx-content p", ".mdx-content h2", "iframe", "#search-bar-entry"];
  return {
    viewport: [innerWidth, innerHeight],
    scroll: [scrollX, scrollY],
    overflow: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
    elements: selectors.map((selector) => {
      const element = document.querySelector(selector);
      if (!element) return { selector, missing: true };
      const style = getComputedStyle(element);
      return { selector, rect: element.getBoundingClientRect().toJSON(), fontFamily: style.fontFamily, fontSize: style.fontSize, lineHeight: style.lineHeight, weight: style.fontWeight, letterSpacing: style.letterSpacing, padding: style.padding, margin: style.margin, border: style.border, radius: style.borderRadius, color: style.color, background: style.backgroundColor, position: style.position, maxWidth: style.maxWidth, display: style.display };
    }),
    rootVariables: Object.fromEntries([...getComputedStyle(document.documentElement)].filter((name) => name.startsWith("--") && /width|primary|background|header|tab/.test(name)).map((name) => [name, getComputedStyle(document.documentElement).getPropertyValue(name)])),
    containers: ["#sidebar", "#navbar", "#content-area", ".card"].map((selector) => {
      let element = document.querySelector(selector);
      const ancestors = [];
      for (let index = 0; element && index < 5; index++, element = element.parentElement) {
        const style = getComputedStyle(element);
        ancestors.push({ tag: element.tagName, classes: element.className, rect: element.getBoundingClientRect().toJSON(), maxWidth: style.maxWidth, width: style.width, gap: style.gap, padding: style.padding, margin: style.margin });
      }
      return { selector, ancestors };
    }),
  };
});
evidence.views.desktop = await measure();
await page.mouse.move(750, 760);
for (let index = 0; index < 8; index++) {
  await page.mouse.wheel(0, 680);
  await page.waitForTimeout(120);
  if (index === 1) await save("opus-source-desktop-1440x1000-middle.png");
}
await save("opus-source-desktop-1440x1000-bottom.png");
await save("opus-source-desktop-1440-full.png", true);
await page.keyboard.press("Control+Home");
await page.waitForTimeout(350);
await page.locator(".card").first().hover();
evidence.cardHover = await page.locator(".card").first().evaluate((element) => ({ border: getComputedStyle(element).border, shadow: getComputedStyle(element).boxShadow, transform: getComputedStyle(element).transform }));
await page.mouse.move(10, 10);
await page.keyboard.press("Control+Home");
await page.getByRole("button", { name: "Open search", exact: true }).click();
await page.waitForTimeout(350);
await save("opus-source-desktop-1440x1000-search.png");
evidence.searchDialog = await page.getByRole("dialog").innerText().catch(() => "Search dialog not exposed via dialog role");
await page.getByRole("combobox").fill("brand").catch(async () => page.getByPlaceholder("Search...").fill("brand"));
await page.waitForTimeout(600);
await save("opus-source-desktop-1440x1000-search-results.png");
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Change theme preference", exact: true }).click();
await page.waitForTimeout(200);
await save("opus-source-desktop-1440x1000-theme-menu.png");
evidence.themeMenu = await page.getByRole("menu").innerText().catch(() => "Theme menu not exposed via menu role");
const darkMenuItem = page.getByText("Dark", { exact: true });
if (await darkMenuItem.count()) {
  await darkMenuItem.click();
  await page.waitForTimeout(350);
  await save("opus-source-desktop-1440x1000-dark.png");
  evidence.views.dark = await measure();
} else await page.keyboard.press("Escape");
await context.clearCookies();
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "domcontentloaded" });
await page.setViewportSize({ width: 1920, height: 1080 });
await page.waitForTimeout(400);
await save("opus-source-wide-1920x1080-top.png");
evidence.views.wide = await measure();
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await save("opus-source-mobile-390x844-top.png");
evidence.views.mobile = await measure();
await page.getByRole("button", { name: "More actions", exact: true }).click();
await page.waitForTimeout(200);
await save("opus-source-mobile-390x844-more-menu.png");
evidence.mobileMoreMenu = await page.getByRole("menu").innerText({ timeout: 800 }).catch(() => "Mobile more actions menu not exposed via menu role; visually contains Dashboard link and close button");
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(300);
await page.getByRole("button", { name: /^Navigation/ }).click();
await page.waitForTimeout(300);
await save("opus-source-mobile-390x844-sidebar.png");
evidence.mobileSidebar = await page.locator("body").innerText();
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
await page.mouse.move(225, 600);
for (let index = 0; index < 3; index++) {
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(150);
}
await save("opus-source-mobile-390x844-cards.png");
await save("opus-source-mobile-390-full.png", true);
evidence.assets = [...requests];
evidence.fontFaces = await page.evaluate(() => [...document.fonts].map((font) => ({ family: font.family, weight: font.weight, status: font.status })));
await writeFile(new URL("measurements.json", researchDir), JSON.stringify(evidence, null, 2));
await browser.close();
console.log(JSON.stringify({ resolved: evidence.resolved, screenshots: (await readdir(referenceDir)).filter((name) => name.startsWith("opus-source-")).length, directory: referenceDir.pathname, mobileOverflow: evidence.views.mobile.overflow, desktopArticle: evidence.views.desktop.elements.find((element) => element.selector === "#content-area"), wideArticle: evidence.views.wide.elements.find((element) => element.selector === "#content-area"), themeMenu: evidence.themeMenu, searchDialog: evidence.searchDialog }, null, 2));
