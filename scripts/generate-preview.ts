#!/usr/bin/env bun
/**
 * Generates preview.png for Open Graph link previews.
 *
 * Loads index.html in headless Chromium at 1200×630 and screenshots it.
 * Run directly to write preview.png; import generateCanvas() in tests.
 *
 * @file generate-preview.ts
 * @version 0.2.0
 * @since 2026-02-18
 * @author tgulls
 * @license MIT
 *
 * @requires module:playwright
 * @requires module:fs
 *
 * @example
 * bun scripts/generate-preview.ts
 * @example
 * bun run generate-preview
 */

import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Render index.html in headless Chromium and return a PNG Buffer.
 * Exported for testing — does not write to disk.
 */
export async function generateCanvas(): Promise<Buffer> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });

  const filePath = join(import.meta.dir, "..", "index.html");
  await page.goto(`file://${filePath}`);

  // Allow fire particles and CSS transitions to settle
  await page.waitForTimeout(600);

  const screenshot = await page.screenshot({ type: "png" });
  await browser.close();

  return Buffer.from(screenshot);
}

/**
 * Write preview.png to the project root.
 * Called only when script is run directly.
 */
export async function generatePreview(): Promise<void> {
  const buf = await generateCanvas();
  const dest = join(import.meta.dir, "..", "preview.png");
  writeFileSync(dest, buf);
  console.log(`preview.png written (${buf.byteLength} bytes)`);
}

if (import.meta.main) {
  await generatePreview();
}
