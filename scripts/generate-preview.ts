#!/usr/bin/env bun
/**
 * Generates preview.png for Open Graph link previews.
 *
 * Draws a 1200×630 static representation of the red envelope app
 * using @napi-rs/canvas. Run directly to write preview.png; import
 * generateCanvas() in tests for dimension and format verification.
 *
 * @file generate-preview.ts
 * @version 0.1.0
 * @since 2026-02-18
 * @author tgulls
 * @license MIT
 *
 * @keywords preview og-image canvas fire-horse
 *
 * @requires module:@napi-rs/canvas
 * @requires module:fs
 *
 * @example
 * bun scripts/generate-preview.ts
 * @example
 * bun run generate-preview
 */

import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync } from "fs";
import { join } from "path";

const WIDTH = 1200;
const HEIGHT = 630;

// Design tokens — match index.html exactly
const C = {
  bg: "#1a0000",
  envelopeTop: "#CC0000",
  envelopeBot: "#8B0000",
  gold: "#FFD700",
  goldDim: "#C9A84C",
  white: "#FFFFFF",
} as const;

/**
 * Draw the preview and return a PNG Buffer.
 * Exported for testing — does not write to disk.
 */
export function generateCanvas(): Buffer {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // ── Background ────────────────────────────────────────────────────────
  const bgGrad = ctx.createRadialGradient(
    WIDTH / 2, HEIGHT / 2, 0,
    WIDTH / 2, HEIGHT / 2, WIDTH * 0.7
  );
  bgGrad.addColorStop(0, "#2a0000");
  bgGrad.addColorStop(1, C.bg);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ── Envelope body ─────────────────────────────────────────────────────
  const envW = 320;
  const envH = 440;
  const envX = (WIDTH - envW) / 2;
  const envY = (HEIGHT - envH) / 2 - 20;
  const r = 8; // corner radius

  const envGrad = ctx.createLinearGradient(envX, envY, envX, envY + envH);
  envGrad.addColorStop(0, C.envelopeTop);
  envGrad.addColorStop(1, C.envelopeBot);

  ctx.beginPath();
  ctx.moveTo(envX + r, envY);
  ctx.lineTo(envX + envW - r, envY);
  ctx.quadraticCurveTo(envX + envW, envY, envX + envW, envY + r);
  ctx.lineTo(envX + envW, envY + envH - r);
  ctx.quadraticCurveTo(envX + envW, envY + envH, envX + envW - r, envY + envH);
  ctx.lineTo(envX + r, envY + envH);
  ctx.quadraticCurveTo(envX, envY + envH, envX, envY + envH - r);
  ctx.lineTo(envX, envY + r);
  ctx.quadraticCurveTo(envX, envY, envX + r, envY);
  ctx.closePath();
  ctx.fillStyle = envGrad;
  ctx.fill();

  // Gold border
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 3;
  ctx.stroke();

  // ── Wax seal ──────────────────────────────────────────────────────────
  const sealX = WIDTH / 2;
  const sealY = envY + envH * 0.38;
  const sealR = 48;

  const sealGrad = ctx.createRadialGradient(
    sealX - 8, sealY - 8, 2,
    sealX, sealY, sealR
  );
  sealGrad.addColorStop(0, "#FFE55C");
  sealGrad.addColorStop(0.6, C.gold);
  sealGrad.addColorStop(1, C.goldDim);

  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.strokeStyle = "#B8860B";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 馬 on seal
  ctx.fillStyle = C.envelopeBot;
  ctx.font = "bold 42px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("馬", sealX, sealY + 2);

  // ── 福 on flap area (top of envelope) ────────────────────────────────
  ctx.fillStyle = C.goldDim;
  ctx.font = "bold 56px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("福", WIDTH / 2, envY + 52);

  // ── Primary text ──────────────────────────────────────────────────────
  ctx.fillStyle = C.gold;
  ctx.font = "bold 38px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("新年快乐 · Happy Chinese New Year", WIDTH / 2, envY + envH + 58);

  // ── Subtext ───────────────────────────────────────────────────────────
  ctx.fillStyle = C.goldDim;
  ctx.font = "22px serif";
  ctx.fillText("🧧  Tap to open your red envelope", WIDTH / 2, envY + envH + 96);

  return canvas.toBuffer("image/png") as Buffer;
}

/**
 * Write preview.png to the project root.
 * Called only when script is run directly.
 */
export function generatePreview(): void {
  const buf = generateCanvas();
  const dest = join(import.meta.dir, "..", "preview.png");
  writeFileSync(dest, buf);
  console.log(`preview.png written (${buf.byteLength} bytes)`);
}

if (import.meta.main) {
  generatePreview();
}
