import { describe, test, expect, beforeAll } from "bun:test";
import { generateCanvas } from "./generate-preview";

describe("generateCanvas", () => {
  let buf: Buffer;

  beforeAll(async () => {
    buf = await generateCanvas();
  }, 30_000);

  test("returns a Buffer", () => {
    expect(buf).toBeInstanceOf(Buffer);
  });

  test("size is greater than 1KB (real PNG, not placeholder)", () => {
    expect(buf.byteLength).toBeGreaterThan(1024);
  });

  test("has PNG magic bytes", () => {
    expect(buf[0]).toBe(0x89);
    expect(buf[1]).toBe(0x50); // P
    expect(buf[2]).toBe(0x4e); // N
    expect(buf[3]).toBe(0x47); // G
  });

  test("dimensions are 1200×630 (OG standard)", () => {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });
});
