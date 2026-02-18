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
