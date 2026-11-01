import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const base = "http://localhost:3000";
const referenceDir = new URL("../docs/design-references/", import.meta.url);
const researchDir = new URL("../docs/research/opus-help/", import.meta.url);
await mkdir(referenceDir, { recursive: true });
await mkdir(researchDir, { recursive: true });
const report = { testedAt: new Date().toISOString(), base, checks: [], routes: [], errors: [], failedResponses: [], measurements: {} };
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: "light", permissions: ["clipboard-read", "clipboard-write"] });
await context.addInitScript(() => {
  const addStyle = () => {
    const style = document.createElement("style");
    style.textContent = "nextjs-portal { display:none !important; }";
    document.head.append(style);
  };
  if (document.head) addStyle(); else addEventListener("DOMContentLoaded", addStyle, { once: true });
});
const page = await context.newPage();
page.on("pageerror", (error) => report.errors.push(String(error)));
page.on("console", (message) => { if (message.type() === "error") report.errors.push(`${message.text()} (${message.location().url})`); });
page.on("response", (response) => { if (response.status() >= 400) report.failedResponses.push({ url: response.url(), status: response.status() }); });
const save = (name, fullPage = false) => page.screenshot({ path: fileURLToPath(new URL(name, referenceDir)), fullPage });
async function visit(path) {
  const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(response.status(), 200, `${path} response`);
  return response;
}
async function check(name, callback) {
  try { const detail = await callback(); report.checks.push({ name, passed: true, detail }); console.log(`PASS ${name}`); }
  catch (error) { report.checks.push({ name, passed: false, error: String(error) }); console.log(`FAIL ${name}: ${error}`); }
}
async function dimensions() {
  return page.evaluate(() => ({ viewport: [innerWidth, innerHeight], documentWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, elements: Object.fromEntries([".site-header", ".desktop-sidebar", ".article-content", ".article-header h1", ".tour-preview", ".resource-card", ".table-of-contents"].map((selector) => { const element = document.querySelector(selector); if (!element) return [selector, null]; const css = getComputedStyle(element); return [selector, { rect: element.getBoundingClientRect().toJSON(), fontSize: css.fontSize, lineHeight: css.lineHeight, fontFamily: css.fontFamily, display: css.display }]; })) }));
}
await check("All registered article routes and source alias render without overflow", async () => {
  await visit("/docs");
  report.contentArticles = await page.locator(".desktop-sidebar a").count();
  const paths = await page.locator(".desktop-sidebar a, .top-tabs a, .resource-card").evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute("href")))]);
  paths.push("/", "/docs/article/introduction", "/docs/article/introduction-to-opusclip");
  for (const path of [...new Set(paths)]) {
    await visit(path);
    const title = await page.locator("h1").innerText();
    const size = await dimensions();
    assert.ok(title.length > 0, `${path} has h1`);
    assert.ok(size.documentWidth <= size.clientWidth, `${path} horizontal overflow`);
    report.routes.push({ path, title, status: 200, overflow: false });
  }
  return `${report.routes.length} routes`;
});
await check("Desktop, wide, mobile, tablet responsive rendering", async () => {
  for (const [name, width, height] of [["desktop", 1440, 1000], ["wide", 1920, 1080], ["mobile", 390, 844], ["tablet", 768, 1024]]) {
    await page.setViewportSize({ width, height });
    await visit("/docs");
    report.measurements[name] = await dimensions();
    assert.ok(report.measurements[name].documentWidth <= width, `${name} overflow`);
    await save(`forma-local-${name}-${width}x${height}-top.png`);
    if (name === "desktop" || name === "mobile") await save(`forma-local-${name}-${width}-full.png`, true);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await visit("/docs");
  return "1440×1000, 1920×1080, 390×844, 768×1024";
});
await check("Reference search shell, keyboard selection, section links, and query URL", async () => {
  await page.keyboard.press("Control+k");
  const input = page.getByRole("combobox", { name: "Search documentation" });
  await input.waitFor();
  await page.waitForTimeout(280);
  const empty = await page.getByRole("dialog").boundingBox();
  assert.equal(empty.width, 640);
  assert.equal(empty.height, 62);
  assert.equal(empty.y, 54);
  assert.equal(await page.getByRole("option").count(), 0);
  await input.fill("workspace");
  assert.equal(new URL(page.url()).searchParams.get("search"), "workspace");
  assert.equal(await page.getByRole("option").count(), 6);
  assert.ok((await page.getByRole("option").evaluateAll(options => options.map(option => option.getBoundingClientRect().height))).every(height => height === 50));
  await input.press("ArrowDown");
  const target = await page.locator('[role="option"][aria-selected="true"]').getAttribute("href");
  await save("forma-local-desktop-1440x1000-search.png");
  await input.press("Enter");
  await page.waitForURL(`${base}${target}`);
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.keyboard.press("Control+k");
  await input.waitFor();
  assert.equal(await input.inputValue(), "");
  assert.equal(await page.getByRole("option").count(), 0);
  await input.fill("autentication");
  assert.ok((await page.getByRole("option").first().getAttribute("href")).endsWith("#authentication"));
  await input.press("Enter");
  await page.waitForURL(`${base}/docs/article/api-overview#authentication`);
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.keyboard.press("Control+k");
  await input.waitFor();
  await page.waitForTimeout(280);
  await input.fill("qzxvbnmksjdhfgpq");
  assert.equal(await page.getByRole("option").count(), 0);
  assert.equal(await input.getAttribute("aria-activedescendant"), null);
  assert.equal((await page.getByRole("dialog").boundingBox()).height, 62);
  await input.fill("");
  assert.ok(await page.getByRole("dialog").isVisible());
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  assert.equal(new URL(page.url()).searchParams.has("search"), false);
  await visit("/docs?search=workspace");
  await input.waitFor();
  assert.equal(await input.inputValue(), "workspace");
  await input.fill("");
  assert.ok(await page.getByRole("dialog").isVisible());
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  const trigger = page.getByRole("button", { name: "Open search", exact: true });
  await trigger.click();
  await input.waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
  return { emptyPanel: "640x62 at y54", resultRows: "50px", selectedTarget: target, typoMatching: true, sectionLinks: true, queryUrl: true, directSearchLink: true, focusRestored: true };
});
await check("Theme dark persistence and System follows device", async () => {
  await visit("/docs");
  await page.getByLabel("Change theme preference", { exact: true }).click();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  assert.equal(await page.locator("html").evaluate((element) => element.classList.contains("dark")), true);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("html").evaluate((element) => element.classList.contains("dark")), true);
  await save("forma-local-desktop-1440x1000-dark.png");
  await page.getByLabel("Change theme preference", { exact: true }).click();
  await page.getByRole("button", { name: "System", exact: true }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  await page.emulateMedia({ colorScheme: "light" });
  await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
  return { persisted: true, systemResponsive: true };
});
await check("Tour all steps, back, direct step and quickstart destination", async () => {
  await page.getByRole("button", { name: "Take a quick tour of Forma" }).click();
  const dialog = page.getByRole("dialog");
  for (let step = 1; step <= 3; step++) {
    await dialog.getByText(`YOUR WORKSPACE, EXPLAINED · 0${step} / 04`, { exact: true }).waitFor();
    await dialog.getByRole("button", { name: "Next", exact: true }).click();
  }
  await dialog.getByRole("button", { name: "Back", exact: true }).click();
  await dialog.getByText("YOUR WORKSPACE, EXPLAINED · 03 / 04", { exact: true }).waitFor();
  await dialog.getByRole("button", { name: "Go to step 1", exact: true }).click();
  await dialog.getByText("YOUR WORKSPACE, EXPLAINED · 01 / 04", { exact: true }).waitFor();
  await dialog.getByRole("button", { name: "Go to step 4", exact: true }).click();
  await save("forma-local-desktop-1440x1000-tour.png");
  await dialog.getByRole("link", { name: "Let’s get started" }).click();
  await page.waitForURL(`${base}/docs/article/quickstart`);
  await save("forma-local-desktop-1440x1000-article.png");
  return { steps: 4, destination: page.url() };
});
await check("FAQ accordions toggle by pointer and keyboard", async () => {
  await visit("/docs/article/faq");
  const accordion = page.locator(".accordion").first();
  await accordion.locator("summary").click();
  assert.equal(await accordion.getAttribute("open"), "");
  await accordion.locator("p").waitFor({ state: "visible" });
  await accordion.locator("summary").press("Enter");
  assert.equal(await accordion.getAttribute("open"), null);
  return "First question opens and closes with content visible";
});
await check("API tabs keyboard navigation and clipboard copy", async () => {
  await visit("/docs/article/api-overview");
  const group = page.locator(".code-group");
  await page.getByRole("tab", { name: "cURL", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.getByRole("tab", { name: "JavaScript", exact: true }).getAttribute("aria-selected"), "true");
  assert.ok((await page.getByRole("tabpanel").innerText()).includes("fetch("));
  await page.keyboard.press("End");
  assert.equal(await page.getByRole("tab", { name: "Python", exact: true }).getAttribute("aria-selected"), "true");
  await page.keyboard.press("Home");
  assert.equal(await page.getByRole("tab", { name: "cURL", exact: true }).getAttribute("aria-selected"), "true");
  for (const language of ["cURL", "JavaScript", "Python"]) {
    await page.getByRole("tab", { name: language, exact: true }).click();
    const code = await page.getByRole("tabpanel").locator("code").innerText();
    await group.getByRole("button", { name: "Copy code", exact: true }).click();
    await group.getByRole("button", { name: "Copied", exact: true }).waitFor();
    assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n"), code.replace(/\r\n/g, "\n"));
  }
  const plainBlock = page.locator(".code-block").first();
  await plainBlock.getByRole("button", { name: "Copy code", exact: true }).click();
  assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n"), await plainBlock.locator("code").innerText());
  await page.getByRole("tab", { name: "cURL", exact: true }).click();
  await save("forma-local-desktop-1440x1000-api.png");
  return { languages: ["cURL", "JavaScript", "Python"], copiedEachLanguageAndPlainBlock: true };
});
await check("Highlighted code remains readable in both themes and scrolls within mobile panels", async () => {
  const pre = page.locator(".code-group .code-content:visible");
  const style = await pre.evaluate(element => {
    const css = getComputedStyle(element);
    return { fontSize: css.fontSize, lineHeight: css.lineHeight, fontWeight: css.fontWeight, background: css.backgroundColor, colors: [...new Set([...element.querySelectorAll("code span")].map(token => getComputedStyle(token).color))] };
  });
  assert.equal(style.fontSize, "14px");
  assert.equal(style.lineHeight, "24px");
  assert.equal(style.fontWeight, "400");
  assert.ok(style.colors.length >= 3, "Syntax distinguishes commands, strings, and flags");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  assert.equal(await pre.evaluate(element => getComputedStyle(element).backgroundColor), style.background);
  await page.setViewportSize({ width: 390, height: 844 });
  await pre.scrollIntoViewIfNeeded();
  const overflow = await pre.evaluate(element => {
    element.scrollLeft = 100;
    return { scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, scrollLeft: element.scrollLeft, documentWidth: document.documentElement.scrollWidth, viewport: innerWidth };
  });
  assert.ok(overflow.scrollWidth > overflow.clientWidth);
  assert.ok(overflow.scrollLeft > 0);
  assert.equal(overflow.documentWidth, overflow.viewport);
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await page.setViewportSize({ width: 1440, height: 1000 });
  return { ...style, mobile: overflow };
});
await check("Table of contents wheel tracking, anchor navigation and return to top", async () => {
  await visit("/docs");
  await page.mouse.move(850, 700);
  await page.mouse.wheel(0, 1350);
  await page.waitForTimeout(450);
  const activeAfterWheel = await page.locator('.table-of-contents [aria-current="location"]').getAttribute("href");
  assert.notEqual(activeAfterWheel, "#getting-started");
  await page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: "More Resources", exact: true }).click();
  await page.waitForTimeout(700);
  assert.equal(await page.locator('.table-of-contents [aria-current="location"]').getAttribute("href"), "#more-resources", JSON.stringify({ y: (await page.locator("#more-resources").boundingBox()).y, scroll: await page.evaluate(() => scrollY) }));
  assert.ok((await page.locator("#more-resources").boundingBox()).y >= 112);
  await page.getByRole("button", { name: "On this page", exact: true }).click();
  await page.waitForTimeout(700);
  assert.equal(await page.evaluate(() => scrollY), 0);
  return { activeAfterWheel, anchor: "#more-resources" };
});
await check("Article feedback responds and stores vote", async () => {
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await page.getByText("Thanks for helping us improve these docs.", { exact: true }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Yes", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await page.evaluate(() => localStorage.getItem("forma-feedback-introduction")), "yes");
  await page.getByRole("button", { name: "No", exact: true }).click();
  assert.equal(await page.evaluate(() => localStorage.getItem("forma-feedback-introduction")), "no");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector('.article-feedback button[aria-pressed="true"]')?.textContent === "No");
  return "Yes and No update message, pressed state, stored vote; vote restored after reload";
});
await check("Mobile drawer closes, navigates and switches documentation area", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit("/docs");
  await page.getByRole("button", { name: "Open documentation navigation", exact: true }).click();
  await page.getByRole("dialog", { name: "Documentation navigation" }).waitFor();
  await save("forma-local-mobile-390x844-drawer.png");
  await page.getByRole("button", { name: "Close navigation", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.getByRole("button", { name: "Open documentation navigation", exact: true }).click();
  await page.getByRole("dialog").getByRole("link", { name: "Set Up Your Workspace", exact: true }).click();
  await page.waitForURL(`${base}/docs/article/quickstart`);
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.getByRole("button", { name: "Open documentation navigation", exact: true }).click();
  await page.getByRole("combobox", { name: "Documentation section", exact: true }).selectOption("/docs/article/faq");
  await page.waitForURL(`${base}/docs/article/faq`);
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.getByRole("button", { name: "Open search", exact: true }).click();
  await page.getByRole("combobox", { name: "Search documentation", exact: true }).fill("privacy");
  await page.getByRole("option").first().click();
  await page.waitForURL(`${base}/docs/article/security`);
  const size = await dimensions();
  assert.ok(size.documentWidth <= 390);
  return { close: true, articleNavigation: true, areaSelect: true, mobileSearch: true };
});
await check("Sidebar sections and link positions stay stable across article navigation", async () => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await visit("/docs");
  const sidebar = page.locator(".desktop-sidebar");
  const sectionStates = () => sidebar.getByRole("button").evaluateAll((buttons) => buttons.map((button) => [button.textContent, button.getAttribute("aria-expanded")]));
  for (const name of ["Getting Started", "Your Workspace"]) {
    await sidebar.getByRole("button", { name, exact: true }).click();
  }
  const states = await sectionStates();
  const article = sidebar.getByRole("link", { name: "Import Your Files", exact: true });
  const before = await article.boundingBox();
  await article.click();
  await page.waitForURL(`${base}/docs/article/import-files`);
  assert.deepEqual(await sectionStates(), states);
  assert.ok(Math.abs((await article.boundingBox()).y - before.y) < 1, "Clicked article moved after navigation");
  await sidebar.getByRole("link", { name: "Create Your First Project", exact: true }).click();
  await page.waitForURL(`${base}/docs/article/create-project`);
  await page.goBack();
  await page.waitForURL(`${base}/docs/article/import-files`);
  assert.deepEqual(await sectionStates(), states);

  const lowerArticle = sidebar.getByRole("link", { name: "Frequently Asked Questions", exact: true });
  await lowerArticle.scrollIntoViewIfNeeded();
  const lowerBefore = await lowerArticle.boundingBox();
  const scrollBefore = await sidebar.evaluate((element) => element.scrollTop);
  await lowerArticle.click();
  await page.waitForURL(`${base}/docs/article/faq`);
  assert.ok(Math.abs((await lowerArticle.boundingBox()).y - lowerBefore.y) < 1, "Scrolled article moved after navigation");
  assert.ok(Math.abs(await sidebar.evaluate((element) => element.scrollTop) - scrollBefore) < 1);
  assert.deepEqual(await sectionStates(), states);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open documentation navigation" }).click();
  let drawer = page.getByRole("dialog", { name: "Documentation navigation" });
  for (const name of ["Getting Started", "Your Workspace"]) {
    assert.equal(await drawer.getByRole("button", { name, exact: true }).getAttribute("aria-expanded"), "false");
  }
  await drawer.getByRole("button", { name: "Customization", exact: true }).click();
  await drawer.getByRole("link", { name: "Import Your Files", exact: true }).click();
  await page.waitForURL(`${base}/docs/article/import-files`);
  await drawer.waitFor({ state: "detached" });
  await page.getByRole("button", { name: "Open documentation navigation" }).click();
  drawer = page.getByRole("dialog", { name: "Documentation navigation" });
  for (const name of ["Getting Started", "Your Workspace", "Customization"]) {
    assert.equal(await drawer.getByRole("button", { name, exact: true }).getAttribute("aria-expanded"), "false");
  }
  await drawer.getByRole("button", { name: "Close navigation" }).click();
  await drawer.waitFor({ state: "detached" });
  return { unrelatedSectionsPreserved: true, linkPositionPreserved: true, sidebarScrollPreserved: true, browserBack: true, mobileDrawer: true };
});
await check("No runtime errors or missing local assets", async () => {
  assert.equal(report.errors.length, 0, report.errors.join("\n"));
  assert.equal(report.failedResponses.length, 0, JSON.stringify(report.failedResponses));
  return { runtimeErrors: report.errors.length, failedResponses: report.failedResponses.length };
});
await check("Source/local desktop and phone comparison artifacts", async () => {
  for (const [source, local, output] of [
    ["opus-source-desktop-1440x1000-top.png", "forma-local-desktop-1440x1000-top.png", "forma-comparison-desktop.png"],
    ["opus-source-mobile-390x844-top.png", "forma-local-mobile-390x844-top.png", "forma-comparison-mobile.png"],
    ["opus-source-wide-1920x1080-top.png", "forma-local-wide-1920x1080-top.png", "forma-comparison-wide.png"],
  ]) {
    const sourceData = await readFile(new URL(source, referenceDir));
    const localData = await readFile(new URL(local, referenceDir));
    const { width, height } = await sharp(sourceData).metadata();
    await sharp({ create: { width: width * 2, height, channels: 3, background: "#eeeeee" } }).composite([{ input: sourceData, left: 0, top: 0 }, { input: localData, left: width, top: 0 }]).png().toFile(fileURLToPath(new URL(output, referenceDir)));
  }
  return "Desktop1440, wide1920, mobile390 source left/local right";
});
await browser.close();
report.passed = report.checks.every((check) => check.passed);
await writeFile(new URL("verification.json", researchDir), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ passed: report.passed, checks: report.checks.length, failed: report.checks.filter((check) => !check.passed), routes: report.routes.length, errors: report.errors, failedResponses: report.failedResponses }, null, 2));
if (!report.passed) process.exitCode = 1;
