import { describe, test, expect, beforeAll } from "bun:test";
import { generateCanvas } from "./generate-preview";

describe("generateCanvas", () => {
  let buf: Buffer;

  beforeAll(() => {
    buf = generateCanvas();
  });

  test("returns a Buffer", () => {
    expect(buf).toBeInstanceOf(Buffer);
  });

  test("size is greater than 1KB (real PNG, not placeholder)", () => {
    expect(buf.byteLength).toBeGreaterThan(1024);
  });

  test("has PNG magic bytes", () => {
    // First 8 bytes of any valid PNG: 89 50 4E 47 0D 0A 1A 0A
    expect(buf[0]).toBe(0x89);
    expect(buf[1]).toBe(0x50); // P
    expect(buf[2]).toBe(0x4e); // N
    expect(buf[3]).toBe(0x47); // G
  });

  test("dimensions are 1200×630 (OG standard)", () => {
    // PNG IHDR chunk: bytes 16-23 are width and height as big-endian uint32
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });
});
