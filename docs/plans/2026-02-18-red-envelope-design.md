# Digital Red Envelope (数字红包) Design

**Date:** 2026-02-18
**Status:** Approved
**Author:** tgulls + Claude
**Source:** brainstorming → writing-plans
**Location:** `index.html`, `preview.png`

---

## Overview

A digital red envelope (红包) for Chinese New Year 2026 — Year of the Fire Horse. A single-file HTML artifact that recipients open in any browser. Clicking the wax seal on the envelope triggers an opening animation that reveals a New Year blessing. Fire particle effects tie into the Fire Horse theme.

Designed to be shared via text message (as a hosted link) or email (as a file attachment).

---

## Core Experience

1. Recipient opens the file or URL
2. A traditional red envelope is centered on screen with fire particles flickering around the wax seal
3. A pulsing glow on the seal signals interactivity — obvious without instructions
4. Tap/click the seal → flap animates open (CSS `rotateX` transform, ~0.6s)
5. Blessing text fades and slides up from inside the envelope
6. Gold particle burst on open

---

## Content

**Default blessing (both languages):**
> 新年快乐，万事如意
> Wishing you a Happy New Year and may all go well

**URL parameter customization:**
- `?msg=Your+custom+message` — overrides the English line
- `?cn=你好世界` — overrides the Chinese line
- No params → default blessing shown

---

## Visual Design

**Color palette:**
- Background: `#1a0000` (dark crimson — night sky over lanterns)
- Envelope body: `#CC0000` → `#8B0000` gradient
- Gold accents: `#FFD700` / `#C9A84C` (borders, patterns, seal)
- Fire particles: `#FF4500` → `#FF8C00` → `#FFD700` → near-white at tips

**Envelope anatomy:**
- Portrait rectangle, centered, responsive to viewport
- Gold geometric border (CSS `border` + `box-shadow`)
- Traditional diamond/rhombus repeating pattern on body
- 福 (fú) character on the flap — gold on red
- Wax seal: circular gold disc with inline SVG horse silhouette

**Typography:**
- Chinese: system font stack — `"PingFang SC"`, `"Microsoft YaHei"`, `"SimSun"`, serif
- English: `Georgia` / serif system font
- No external fonts — offline safe, works on Chinese devices natively

**Animations:**
- Seal: slow breathing `box-shadow` glow (signals interactivity)
- Flap open: CSS `rotateX` transform (~0.6s ease-in-out)
- Message reveal: `opacity` + `translateY` fade-in after flap finishes
- Fire: always running, intensifies briefly on open

> **Note:** Reference images of traditional red envelopes to be added to `reference/` before implementation begins. Use them to inform flap shape, decorative patterns, and proportions.

---

## Technical Architecture

**Deliverables:** `index.html` + `preview.png` (two files total)

```
fire-horse/
├── index.html        ← self-contained app (CSS + JS inlined)
├── preview.png       ← OG preview image (~5-10KB static PNG)
├── reference/        ← design reference images (not embedded)
└── docs/plans/
    └── 2026-02-18-red-envelope-design.md
```

**`index.html` internal structure:**
```
<head>    — OG meta tags, viewport, inline styles
<style>   — All CSS (envelope layout, animations, typography)
<canvas>  — Fire particle system (z-indexed behind seal)
<script>  — Canvas fire engine + open interaction + URL param parsing
```

**Fire particle system (Canvas):**
- ~60 particles with position, velocity, life, size, color
- Runs on `requestAnimationFrame`, pauses when tab is hidden
- On open: brief intensity burst, then settles to ambient flicker
- Canvas is absolutely positioned, z-indexed behind seal

**Open Graph / link preview:**
- `og:title`: `新年快乐 · Happy Chinese New Year 🧧`
- `og:description`: `🧧 新年快乐 · Happy Chinese New Year — Tap to open your red envelope!`
- `og:image`: `preview.png` (static red envelope PNG, ~5-10KB)
- Fallback: description text shown if image unavailable
- Previews only work when hosted (not file attachment); file attachment recipients see the file directly

**Mobile support:**
- Viewport meta tag (`width=device-width, initial-scale=1`)
- `touchstart` events alongside `click` for iOS/Android tap
- Responsive layout — envelope scales to viewport, max-width on desktop
- Canvas resizes on orientation change
- WeChat in-app browser compatible

**Browser support:** Any browser from ~2018+, including WeChat in-app browser

---

## Approach Decision Log

Three approaches were considered for the animation/fire implementation:

### Option A — Pure CSS (not chosen)
Fire simulated with layered, animated gradient blobs using CSS keyframe animations. Zero JS for visuals. Smallest file, maximum compatibility. Fire looks more like a shimmer than actual flames.

**Trade-off:** Safest and most compatible, but fire effect is less convincing.

### Option B — Vanilla JS + Canvas Fire (chosen)
Envelope animation in CSS, fire rendered on Canvas with a particle system (~60 particles). Realistic flickering flames. Single file, no dependencies. More visually striking — especially appropriate for Year of the Fire Horse.

**Trade-off:** Slightly more complex JS, but fire genuinely looks like fire.

### Option C — CSS + Inline SVG Filters (not chosen)
SVG `feTurbulence` + `feDisplacementMap` filters for organic, wavy fire effect. Distinct "painted" aesthetic. Renders inconsistently across browsers.

**Trade-off:** Visually elegant but unpredictable cross-browser behavior — too risky for recipients on unknown devices.

**Decision:** Option B chosen for visual impact. Revert to Option A if performance issues arise on older mobile devices.
