# TRANSMISSION LOST — promo site

Static promo page for the retro narrative puzzle horror game **Transmission Lost**.
Plain HTML / CSS / JS, no build step. Served from the root of `main` via GitHub Pages.

## Live site
`https://janetcheng0311.github.io/Hello-Trasmission-Lost/` (after Pages is enabled)

## Edit your details (no coding needed)

**1. itch.io + social links** — open `script.js`, edit the block at the very top:

```js
const ITCH_URL = "https://yourname.itch.io/transmission-lost";
const SOCIAL = {
  discord: "https://discord.gg/...",
  "x / twitter": "https://x.com/...",
  "press kit": "https://...",   // or "" to hide
};
```

That single change updates every "play demo" / "download" button and the footer links.

**2. Game name + story + features** — edit the text directly in `index.html`
(hero title, the `RECOVERED_LOG` story section, and `features.txt`).

**3. Screenshots** — replace the placeholder images.
- Drop your real screenshots into an `assets/` folder.
- In `index.html`, change each gallery `<img src="https://picsum.photos/...">` to e.g. `src="assets/shot-01.png"`.
- The placeholders use a green CRT filter so stock images look on-theme. If your real
  screenshots are already green/styled, remove the `filter:` line under `.shot img` in `styles.css`.

**4. Logo** — the title is set in type (`TRANSMISSION LOST` in the hero). If you have a
logo image, replace the `<h1 class="hero__title">` with an `<img>` pointing at `assets/logo.png`.

**5. Social share image** — add `assets/og-cover.png` (1200×630) for nice link previews.

## Local preview
Just open `index.html` in a browser, or run any static server:

```bash
python3 -m http.server 8000
```

## Accessibility / performance notes
- Dark, terminal-green theme by design (it is a CRT).
- All flicker / glitch / typing effects collapse to static under `prefers-reduced-motion`.
- No external JS or font dependencies; loads instantly.
