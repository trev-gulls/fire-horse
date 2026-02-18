import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from "bun:test";
import { chromium, Browser, Page } from "playwright";
import { join } from "path";

const FILE_URL = `file://${join(import.meta.dir, "..", "index.html")}`;

describe("Red Envelope UI", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => { browser = await chromium.launch(); }, 30_000);
  afterAll(async () => { await browser.close(); });
  beforeEach(async () => { page = await browser.newPage(); await page.goto(FILE_URL); });
  afterEach(async () => { await page.close(); });

  // Initial state
  test("seal is visible on load", async () => {
    expect(await page.locator(".seal").isVisible()).toBe(true);
  });

  test("envelope starts closed", async () => {
    const cls = await page.locator(".envelope").getAttribute("class");
    expect(cls).not.toContain("is-open");
  });

  test("message is hidden on load", async () => {
    const opacity = await page.locator(".message").evaluate(
      (el) => parseFloat(getComputedStyle(el).opacity)
    );
    expect(opacity).toBeLessThan(0.1);
  });

  // Interaction
  test("clicking seal opens envelope", async () => {
    await page.locator(".seal").click();
    const cls = await page.locator(".envelope").getAttribute("class");
    expect(cls).toContain("is-open");
  });

  test("message appears after opening", async () => {
    await page.locator(".seal").click();
    await page.waitForTimeout(1500);
    const opacity = await page.locator(".message").evaluate(
      (el) => parseFloat(getComputedStyle(el).opacity)
    );
    expect(opacity).toBeGreaterThan(0.9);
  });

  // URL params
  test("?msg= overrides English line", async () => {
    await page.goto(`${FILE_URL}?msg=Hello+World`);
    await page.locator(".seal").click();
    await page.waitForTimeout(1500);
    expect(await page.locator("#message-en").textContent()).toContain("Hello World");
  });

  test("?cn= overrides Chinese line", async () => {
    await page.goto(`${FILE_URL}?cn=你好世界`);
    await page.locator(".seal").click();
    await page.waitForTimeout(1500);
    expect(await page.locator("#message-cn").textContent()).toContain("你好世界");
  });
});
