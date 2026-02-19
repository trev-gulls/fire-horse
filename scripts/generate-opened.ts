#!/usr/bin/env bun
/**
 * Generates preview-opened.png showing the envelope in its open state.
 *
 * @file generate-opened.ts
 * @version 0.1.0
 * @since 2026-02-18
 * @author tgulls
 */

import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });

const filePath = join(import.meta.dir, "..", "index.html");
await page.goto(`file://${filePath}`);
await page.waitForTimeout(400);
await page.locator(".seal").click();
await page.waitForTimeout(3500);

const buf = await page.screenshot({ type: "png" });
const dest = join(import.meta.dir, "..", "preview-opened.png");
writeFileSync(dest, Buffer.from(buf));
console.log(`preview-opened.png written (${buf.byteLength} bytes)`);

await browser.close();
