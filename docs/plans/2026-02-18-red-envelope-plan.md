# Digital Red Envelope Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-file HTML digital red envelope with fire particle effects that opens on tap/click to reveal a Chinese New Year blessing, shareable via link or attachment.

**Architecture:** Single self-contained `index.html` — all CSS and JS inlined, no external dependencies, no build step. A companion `preview.png` provides the Open Graph image for link previews when hosted. Canvas-based fire particle system renders behind the wax seal; CSS transforms handle the envelope opening animation.

**Tech Stack:** Vanilla HTML5, CSS3 (transforms, keyframes), Canvas 2D API, zero dependencies.

**Design reference:** `docs/plans/2026-02-18-red-envelope-design.md`

> **Note:** Before starting Task 3 (visual design), add reference images of traditional red envelopes to `reference/`. This will inform exact flap shape, decorative pattern, and proportions.

---

### Task 1: Project Setup

**Files:**
- Create: `index.html`
- Create: `.claude/CLAUDE.md`
- Create: `.gitignore`

**Step 1: Initialize git**

```bash
git init
git branch -m main
```

Expected: `Initialized empty Git repository in .../fire-horse/.git/`

**Step 2: Create `.gitignore`**

```
.DS_Store
*.local
```

**Step 3: Create `.claude/CLAUDE.md`**

```markdown
# fire-horse

Digital red envelope (红包) for Chinese New Year 2026 — Year of the Fire Horse.

## Project Rules

- Single-file deliverable: `index.html` + `preview.png`
- No build step, no dependencies, no CDN links — must work offline as file attachment
- All CSS and JS must be inlined inside `index.html`
- Do not add external font links, script tags pointing to CDNs, or import statements
- `reference/` folder contains design reference images only — do not embed them in the HTML
- URL params: `?msg=` overrides English line, `?cn=` overrides Chinese line

## Commands

- Test: Open `index.html` in a browser — no server required
- Share as file: Attach `index.html` to email/message
- Host: `npx serve .` or drag folder to Netlify/GitHub Pages
```

**Step 4: Create empty `index.html` skeleton**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>新年快乐 · Happy Chinese New Year 🧧</title>

  <!-- Open Graph / link preview -->
  <meta property="og:title" content="新年快乐 · Happy Chinese New Year 🧧" />
  <meta property="og:description" content="🧧 新年快乐 · Happy Chinese New Year — Tap to open your red envelope!" />
  <meta property="og:image" content="preview.png" />
  <meta property="og:type" content="website" />

  <style>
    /* styles go here */
  </style>
</head>
<body>
  <!-- envelope markup goes here -->
  <canvas id="fire-canvas"></canvas>
  <script>
    // scripts go here
  </script>
</body>
</html>
```

**Step 5: Open in browser and verify**

Open `index.html` in Chrome/Safari.
Expected: Blank page, no console errors.

**Step 6: Commit**

```bash
git add .
git commit -m "chore: initialize project with skeleton and CLAUDE.md"
```

---

### Task 2: Envelope HTML Structure

**Files:**
- Modify: `index.html` — add envelope markup inside `<body>`

**Step 1: Add envelope markup**

Replace the `<!-- envelope markup goes here -->` comment with:

```html
<div class="scene">
  <div class="envelope" id="envelope">
    <!-- Back of envelope (always behind) -->
    <div class="envelope-back"></div>

    <!-- Flap (folds up to open) -->
    <div class="envelope-flap" id="flap">
      <div class="fu-character">福</div>
    </div>

    <!-- Front body of envelope -->
    <div class="envelope-front">
      <!-- Wax seal (the click target) -->
      <div class="seal" id="seal" role="button" aria-label="Tap to open">
        <!-- Horse SVG silhouette -->
        <svg class="seal-icon" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <!-- Simplified horse head silhouette -->
          <path d="M20 8 C14 8 10 12 10 17 C10 20 11 22 13 24 L12 32 L16 32 L16 26 C17 27 18 28 20 28 C22 28 23 27 24 26 L24 32 L28 32 L27 24 C29 22 30 20 30 17 C30 12 26 8 20 8 Z M17 18 C16 18 15 17 15 16 C15 15 16 14 17 14 C18 14 19 15 19 16 C19 17 18 18 17 18 Z" fill="#8B6914"/>
        </svg>
      </div>
    </div>

    <!-- Message (hidden until open) -->
    <div class="message" id="message" aria-live="polite">
      <div class="message-cn" id="message-cn">新年快乐，万事如意</div>
      <div class="message-en" id="message-en">Wishing you a Happy New Year and may all go well</div>
      <div class="message-year">🐎 2026 · 年</div>
    </div>
  </div>
</div>
```

**Step 2: Verify structure in browser**

Open `index.html`.
Expected: Unstyled text and elements visible — a 福 character, some text, an SVG. No errors in console.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add envelope HTML structure"
```

---

### Task 3: Envelope CSS — Layout and Base Styles

> **Before this task:** Add reference images to `reference/` and review them for flap shape, pattern, and proportions.

**Files:**
- Modify: `index.html` — fill in the `<style>` block

**Step 1: Add base reset and scene styles**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a0000;
  font-family: "PingFang SC", "Microsoft YaHei", "SimSun", serif;
  overflow: hidden;
}

.scene {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}
```

**Step 2: Add envelope dimensions and positioning**

```css
.envelope {
  position: relative;
  width: min(320px, 85vw);
  height: min(460px, 80vh);
  cursor: default;
  user-select: none;
}

.envelope-back,
.envelope-front,
.envelope-flap {
  position: absolute;
  left: 0;
  width: 100%;
  border-radius: 4px;
}
```

**Step 3: Add envelope body styles**

```css
.envelope-back {
  top: 0;
  height: 100%;
  background: linear-gradient(160deg, #CC0000 0%, #8B0000 100%);
  border: 2px solid #C9A84C;
  box-shadow:
    0 0 0 4px #8B0000,
    0 0 0 6px #C9A84C,
    0 8px 40px rgba(0,0,0,0.6);
  border-radius: 4px;
}

.envelope-front {
  top: 35%;  /* front covers lower portion */
  height: 65%;
  background: linear-gradient(180deg, #AA0000 0%, #8B0000 100%);
  border-top: 2px solid #C9A84C;
  border-left: 2px solid #C9A84C;
  border-right: 2px solid #C9A84C;
  z-index: 2;
  /* Diamond pattern overlay */
  background-image:
    linear-gradient(45deg, rgba(201,168,76,0.15) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(201,168,76,0.15) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(201,168,76,0.15) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(201,168,76,0.15) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-color: #9B0000;
}
```

**Step 4: Add flap styles**

```css
.envelope-flap {
  top: 0;
  height: 40%; /* flap covers top 40% */
  background: linear-gradient(180deg, #CC0000 0%, #AA0000 100%);
  border-bottom: 2px solid #C9A84C;
  /* Clip to a triangle/pointed shape */
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  z-index: 3;
  transform-origin: top center;
  transition: transform 0.6s ease-in-out;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8%;
}

.fu-character {
  font-size: clamp(2rem, 8vw, 3.5rem);
  color: #FFD700;
  text-shadow: 0 0 12px rgba(255,215,0,0.6);
  line-height: 1;
}
```

**Step 5: Verify in browser**

Expected: A red envelope shape with pointed flap, gold borders, 福 character visible on flap, diamond pattern on body.

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add envelope CSS layout and base styles"
```

---

### Task 4: Wax Seal Styles and Pulse Animation

**Files:**
- Modify: `index.html` — add to `<style>` block

**Step 1: Add seal styles**

```css
.seal {
  position: absolute;
  width: clamp(64px, 18vw, 88px);
  height: clamp(64px, 18vw, 88px);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #FFD700, #C9A84C 60%, #8B6914);
  border: 3px solid #8B6914;
  box-shadow:
    0 0 0 2px #FFD700,
    0 4px 12px rgba(0,0,0,0.5);
  top: -44px; /* overlaps flap/front boundary */
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  animation: seal-pulse 2.4s ease-in-out infinite;
}

.seal-icon {
  width: 55%;
  height: 55%;
}
```

**Step 2: Add pulse animation**

```css
@keyframes seal-pulse {
  0%, 100% {
    box-shadow:
      0 0 0 2px #FFD700,
      0 4px 12px rgba(0,0,0,0.5),
      0 0 16px 4px rgba(255,150,0,0.3);
  }
  50% {
    box-shadow:
      0 0 0 2px #FFD700,
      0 4px 12px rgba(0,0,0,0.5),
      0 0 28px 10px rgba(255,150,0,0.55);
  }
}
```

**Step 3: Position seal on the envelope**

The seal sits at the junction of the flap and front. Make sure `.envelope-front` has `position: relative` and the seal is inside `.envelope-front`:

The seal markup is already inside `.envelope-front`. The `top: -44px` pulls it up to straddle the flap/body boundary.

**Step 4: Verify in browser**

Expected: Gold circular seal centered on envelope, pulsing glow animation running, horse silhouette visible inside.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add wax seal styles and pulse animation"
```

---

### Task 5: Canvas Fire Particle System

**Files:**
- Modify: `index.html` — add to `<style>` and `<script>` blocks

**Step 1: Style the canvas**

Add to `<style>`:

```css
#fire-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* clicks pass through to envelope */
  z-index: 5; /* above envelope, below nothing (seal is z-index 10) */
}
```

**Step 2: Write the particle system**

Add to `<script>`:

```javascript
// ─── Fire Particle System ───────────────────────────────────────────────────

const canvas = document.getElementById('fire-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let fireIntensity = 1; // multiplier: 1 = ambient, 3 = burst on open

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor(x, y) {
    this.reset(x, y);
  }

  reset(x, y) {
    // Spawn near the seal — offset by ±30px horizontally
    this.x = x + (Math.random() - 0.5) * 60;
    this.y = y + (Math.random() - 0.5) * 20;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = -(Math.random() * 2.5 + 1) * fireIntensity;
    this.life = 1.0; // 1.0 = full, 0 = dead
    this.decay = Math.random() * 0.018 + 0.012;
    this.size = Math.random() * 12 + 4;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx += (Math.random() - 0.5) * 0.3; // flicker
    this.life -= this.decay;
  }

  draw() {
    if (this.life <= 0) return;
    // Color shifts: orange → yellow → white as particle ages (life goes from 1 → 0)
    const t = 1 - this.life;
    const r = 255;
    const g = Math.floor(t < 0.5 ? t * 2 * 160 : 160 + (t - 0.5) * 2 * 95);
    const b = Math.floor(t > 0.7 ? (t - 0.7) * 3.3 * 255 : 0);
    ctx.save();
    ctx.globalAlpha = this.life * 0.85;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function getSealCenter() {
  const seal = document.getElementById('seal');
  const rect = seal.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function spawnParticles() {
  const target = Math.floor(60 * fireIntensity);
  if (particles.length < target) {
    const { x, y } = getSealCenter();
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(x, y));
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const { x, y } = getSealCenter();

  // Respawn dead particles
  particles = particles.filter(p => {
    if (p.life <= 0) {
      p.reset(x, y);
      return true;
    }
    return true;
  });

  spawnParticles();

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();

// Fire burst on envelope open — called from open handler (Task 6)
function fireBurst() {
  fireIntensity = 3;
  setTimeout(() => { fireIntensity = 1; }, 1200);
}
```

**Step 3: Verify in browser**

Expected: Orange/yellow fire particles rising from where the seal is centered. Particles flicker and fade. No console errors.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add canvas fire particle system"
```

---

### Task 6: Envelope Open Interaction

**Files:**
- Modify: `index.html` — add to `<style>` and `<script>` blocks

**Step 1: Add opened state CSS**

Add to `<style>`:

```css
/* Flap folds back when envelope is opened */
.envelope.is-open .envelope-flap {
  transform: rotateX(-170deg);
}

/* Message hidden by default, revealed on open */
.message {
  position: absolute;
  top: 10%;
  left: 0;
  right: 0;
  text-align: center;
  padding: 0 24px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s;
  z-index: 1; /* behind front panel, revealed as front lifts */
  pointer-events: none;
}

.envelope.is-open .message {
  opacity: 1;
  transform: translateY(0);
}

.message-cn {
  font-size: clamp(1.4rem, 5vw, 2rem);
  color: #FFD700;
  text-shadow: 0 0 16px rgba(255,215,0,0.5);
  line-height: 1.4;
  margin-bottom: 12px;
}

.message-en {
  font-size: clamp(0.85rem, 3vw, 1.05rem);
  color: #FFECB3;
  font-style: italic;
  line-height: 1.5;
  margin-bottom: 16px;
}

.message-year {
  font-size: clamp(0.8rem, 2.5vw, 0.95rem);
  color: #C9A84C;
  letter-spacing: 0.1em;
}

/* Seal hides after open */
.envelope.is-open .seal {
  animation: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
```

**Step 2: Add open interaction JS**

Add to `<script>` (after the fire system):

```javascript
// ─── Envelope Open Interaction ───────────────────────────────────────────────

const envelope = document.getElementById('envelope');
const seal = document.getElementById('seal');
let isOpen = false;

function openEnvelope() {
  if (isOpen) return;
  isOpen = true;
  envelope.classList.add('is-open');
  fireBurst();
}

// Support both click (desktop) and touch (mobile)
seal.addEventListener('click', openEnvelope);
seal.addEventListener('touchstart', (e) => {
  e.preventDefault(); // prevent double-fire on mobile
  openEnvelope();
}, { passive: false });
```

**Step 3: Verify in browser**

Open `index.html`. Click the seal.
Expected:
- Flap folds back (rotateX transform)
- Message fades in from below
- Fire particles burst briefly
- Seal disappears
- Blessing text visible: Chinese on top, English below

**Step 4: Test on mobile**

Open in Safari on iPhone or use Chrome DevTools mobile emulation.
Expected: Touch on seal triggers the same animation without double-firing.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add envelope open animation and interaction"
```

---

### Task 7: URL Parameter Customization

**Files:**
- Modify: `index.html` — add to `<script>` block

**Step 1: Add URL param parsing**

Add to `<script>` (before the open interaction code):

```javascript
// ─── URL Parameter Customization ─────────────────────────────────────────────

const DEFAULT_CN = '新年快乐，万事如意';
const DEFAULT_EN = 'Wishing you a Happy New Year and may all go well';

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const cnEl = document.getElementById('message-cn');
const enEl = document.getElementById('message-en');

const customCn = getParam('cn');
const customEn = getParam('msg');

if (customCn) cnEl.textContent = customCn;
if (customEn) enEl.textContent = customEn;
```

**Step 2: Verify with URL params**

Open: `index.html?msg=Happy+New+Year+Grandma!`
Expected: After opening, English line reads "Happy New Year Grandma!"

Open: `index.html?cn=恭喜发财&msg=Wishing+you+prosperity`
Expected: Both lines overridden.

Open: `index.html` (no params)
Expected: Default blessing shown.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add URL parameter customization for blessing text"
```

---

### Task 8: Preview Image (`preview.png`)

**Files:**
- Create: `preview.png`

**Note:** `preview.png` is a static companion file. It only matters when the app is hosted (GitHub Pages, Netlify) — file attachments don't use OG previews.

**Step 1: Generate the preview image**

Use this HTML snippet to create a simple red envelope preview. Open in browser, screenshot at 1200×630px, save as `preview.png`:

```html
<!-- Save this as preview-generator.html, open, screenshot, then delete -->
<!DOCTYPE html>
<html>
<head>
<style>
body { margin: 0; background: #1a0000; display: flex; align-items: center; justify-content: center; width: 1200px; height: 630px; font-family: "PingFang SC", "Microsoft YaHei", serif; }
.card { width: 280px; height: 400px; background: linear-gradient(160deg, #CC0000, #8B0000); border: 3px solid #C9A84C; box-shadow: 0 0 0 6px #8B0000, 0 0 0 8px #C9A84C; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.fu { font-size: 5rem; color: #FFD700; text-shadow: 0 0 20px rgba(255,215,0,0.6); }
.text { color: #FFD700; font-size: 1.2rem; text-align: center; }
</style>
</head>
<body>
<div class="card">
  <div class="fu">福</div>
  <div class="text">新年快乐<br><span style="font-size:0.85rem;color:#FFECB3">Tap to open your red envelope 🧧</span></div>
</div>
</body>
</html>
```

Alternatively, use any image editor to create a 1200×630px dark red image with a centered envelope graphic and gold 福 character.

**Step 2: Verify OG tag points to it**

Confirm `index.html` `<head>` contains:
```html
<meta property="og:image" content="preview.png" />
```

**Step 3: Test preview (requires hosting)**

If you have GitHub Pages or Netlify available:
- Push both files
- Use https://opengraph.xyz or paste the URL into iMessage to verify the preview card

**Step 4: Commit**

```bash
git add preview.png
git commit -m "feat: add OG preview image for link sharing"
```

---

### Task 9: Polish and Responsive Fixes

**Files:**
- Modify: `index.html`

**Step 1: Add orientation change handler for canvas**

Add to `<script>`:

```javascript
window.addEventListener('orientationchange', () => {
  setTimeout(resizeCanvas, 100); // wait for orientation to settle
});
```

**Step 2: Add `perspective` to enable 3D flap fold**

The `rotateX` flap animation needs a 3D perspective to look right. Add to `.scene`:

```css
.scene {
  perspective: 800px;
}

.envelope-flap {
  transform-style: preserve-3d;
}
```

**Step 3: Add a subtle decorative border to the page**

Add to `body`:

```css
body::before {
  content: '';
  position: fixed;
  inset: 12px;
  border: 1px solid rgba(201,168,76,0.2);
  border-radius: 8px;
  pointer-events: none;
  z-index: 100;
}
```

**Step 4: Verify full experience**

Check all of these:
- [ ] Seal pulse animation runs on load
- [ ] Fire particles rise from seal location
- [ ] Click seal → flap folds back, message fades in, fire bursts
- [ ] Touch works on mobile (no double-fire)
- [ ] `?msg=` and `?cn=` params override text
- [ ] Looks correct on portrait phone (320px width minimum)
- [ ] Looks correct on desktop (centered, max-width respected)
- [ ] No console errors

**Step 5: Final commit**

```bash
git add index.html
git commit -m "feat: polish — 3D perspective, orientation fix, border accent"
```

---

### Task 10: README and Sharing Guide

**Files:**
- Create: `README.md`

**Step 1: Write README**

```markdown
# 🧧 火马红包 · Fire Horse Red Envelope

A digital red envelope for Chinese New Year 2026 — Year of the Fire Horse.

## Sharing

**As a link (recommended):**
Share your GitHub Pages URL. Personalize per recipient with URL params:

- Generic: `https://trev-gulls.github.io/fire-horse/`
- Personalized English: `https://trev-gulls.github.io/fire-horse/?msg=Happy+New+Year+Grandma!`
- Personalized both: `https://trev-gulls.github.io/fire-horse/?cn=恭喜发财&msg=Wishing+you+prosperity`

**As a file:**
Attach `index.html` to an email or message. Recipients open it in their browser.
Note: OG link previews (iMessage, WeChat) only work with the hosted link, not the file.

## Hosting on GitHub Pages

1. Create a GitHub repo named `fire-horse` at github.com/trev-gulls
2. Push this project: `git remote add origin https://github.com/trev-gulls/fire-horse.git && git push -u origin main`
3. In repo Settings → Pages → Source: Deploy from branch → `main` → `/ (root)`
4. Your URL will be: `https://trev-gulls.github.io/fire-horse/`
5. Update `og:image` and `og:url` in `index.html` to use this absolute URL (see Deployment section in `.claude/CLAUDE.md`)

## Development

No build step required. Open `index.html` in any browser to preview.
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with GitHub Pages sharing guide"
```

---

### Task 11: GitHub Pages Deployment

**Files:**
- Modify: `index.html` — update OG absolute URLs
- Run: `git remote add`, `git push`

> **Prerequisites:** GitHub repo `fire-horse` must exist at github.com/trev-gulls

**Step 1: Update OG absolute URLs in `index.html`**

Replace the placeholder OG values with the real GitHub Pages URLs:

```html
<!-- Change og:image from -->
<meta property="og:image" content="preview.png" />
<!-- To -->
<meta property="og:image" content="https://trev-gulls.github.io/fire-horse/preview.png" />

<!-- Change og:url from -->
<meta property="og:url" content="https://your-domain.com/" />
<!-- To -->
<meta property="og:url" content="https://trev-gulls.github.io/fire-horse/" />
```

**Step 2: Commit the URL update**

```bash
git add index.html
git commit -m "fix: set absolute GitHub Pages URLs for OG meta tags"
```

**Step 3: Create the GitHub repo**

Go to https://github.com/new and create a public repo named `fire-horse`. Do not initialize with README (we have one).

**Step 4: Push to GitHub**

```bash
git remote add origin https://github.com/trev-gulls/fire-horse.git
git push -u origin main
```

**Step 5: Enable GitHub Pages**

In the repo on GitHub:
- Settings → Pages
- Source: Deploy from branch
- Branch: `main`, folder: `/ (root)`
- Save

GitHub Pages will be live at `https://trev-gulls.github.io/fire-horse/` within ~60 seconds.

**Step 6: Verify**

- Open `https://trev-gulls.github.io/fire-horse/` in browser — app should load
- Send the link to yourself in iMessage — preview card should show `preview.png` and the tap-to-open description
- Test a personalized URL: `https://trev-gulls.github.io/fire-horse/?msg=Happy+New+Year!`

---

## Done

The app is complete when:
- [ ] `index.html` opens in browser with no errors
- [ ] Fire particles visible around seal on load
- [ ] Seal click/tap opens envelope with animation
- [ ] Blessing text appears (both Chinese and English)
- [ ] URL params `?msg=` and `?cn=` work
- [ ] Works on mobile (touch, responsive layout)
- [ ] `preview.png` present for OG link preview
- [ ] Hosted at `https://trev-gulls.github.io/fire-horse/`
- [ ] OG preview card works in iMessage
