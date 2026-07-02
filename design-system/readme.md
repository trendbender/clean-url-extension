# Clean URL — Design System

A production-ready design system for **Clean URL**, a lightweight Chrome extension that removes tracking parameters (UTM, click IDs, LinkedIn/Google/YouTube/Amazon trackers, and `#:~:text=` fragments) from URLs in one click.

The primary surface is a **360px-wide browser-action popup** — dark, glassy, and minimal. Everything here is derived directly from the extension's real source (`popup.css`, `popup.html`, `popup.js`, `cleaner.js`, `service_worker.js`) so it doubles as a developer handoff.

**Tagline:** *One-click link cleaner* · **Voice:** privacy-first, fast, trustworthy, minimal.

---

## Sources

- **GitHub:** [`trendbender/clean-url-extension`](https://github.com/trendbender/clean-url-extension) (`main`) — the ground-truth extension. Tokens copied verbatim from `popup.css :root`; component states from `popup.css`; copy from `_locales/`. Explore this repo to build higher-fidelity designs against the live product.
- Localized strings for 7 languages live in `_locales/{en,de,es,fr,pt_BR,ru,zh_CN}/messages.json` — **layouts must tolerate long German/Russian strings** (e.g. "Sicherheitsmodus: Original-URL wird verwendet").

The `icon16/32/48/128.png` files are the extension's real shipped icons (a flat "CU" on solid navy). This system's **definitive brand mark** is the gradient "CU" monogram in `assets/logo-cu.svg`, rasterized to `assets/icon-gradient-{16,32,48,128}.png` for shipping — see *Iconography*.

---

## Index

**Foundations (root)**
- `styles.css` — global entry point (consumers link this). `@import`s only.
- `tokens/colors.css` · `tokens/typography.css` · `tokens/spacing.css` — all CSS custom properties.

**Components** (`components/`, namespace `CleanURLDesignSystem_814f5d`)
- `buttons/` — **Button** (primary gradient · ghost)
- `forms/` — **Toggle** (cleaning-rule pill) · **UrlField** (read-only URL field)
- `layout/` — **Card** (glass container) · **BrandRow** (popup header)
- `feedback/` — **StatusLine** (neutral/success/error) · **RemovedHint** ("Removed N params") · **ToolbarBadge** (green ✓)

**UI kit** (`ui_kits/popup/`)
- `index.html` — assembled 360px popup in 3 states (default · cleaned · copied) + context menu
- `redlines.html` — annotated spec (paddings, margins, radii)
- `PopupScreen.jsx` · `ContextMenu.jsx`

**Specimen cards** (`guidelines/`) — Colors, Type, Spacing, Brand groups in the Design System tab.

**Assets** (`assets/`) — shipped PNG icons + new SVG logo/toolbar treatments.

---

## Content fundamentals

Copy is **terse, literal, and imperative** — it tells you what a control does, not how it feels.

- **Casing:** Title Case on buttons and the app title ("Copy Clean", "Clean URL"); sentence case on hints and status lines ("Removed 5 params", "Copied clean URL").
- **Voice:** no "I", minimal "you". Labels are noun phrases ("Original URL", "Cleaning rules"); actions are bare verbs ("Copy Clean", "Open Clean").
- **Precision over polish:** rules name the exact params they strip — "Remove UTM (utm_*)", "Remove click IDs (gclid, fbclid, …)". The `(…)` example list is part of the voice.
- **Reassurance through transparency:** the "Removed N params" counter and the fail-safe line ("Fail-safe: using original URL") tell the user exactly what happened. Nothing is hidden.
- **No emoji in copy.** The only glyphs used are the toolbar ✓/! badge and the `…` ellipsis in rule examples.
- **Numbers stay literal:** "Removed 0 params" is shown, not suppressed — honesty over cleverness.

Localization note: all visible strings resolve through `chrome.i18n`; English is the reference. Because German/Russian run ~30–40% longer, **every label wraps** and no control assumes a fixed single-line width.

---

## Visual foundations

**Overall vibe:** dark "glassmorphism" — a near-black navy field lit by two soft colored glows, with translucent blurred cards floating on hairline white borders. Calm, technical, trustworthy.

- **Color:** background `#0b1220`; raised card base `#0f1a2e`; primary text `#e9eefc`; muted `#97a7c8`. Two accents — **blue `#5aa8ff`** (focus, links, primary) and **mint `#7cf0c0`** (success). Danger `#ff6b6b`; toolbar badge green `#22c55e`. Two accents only; used sparingly against a mostly monochrome navy field.
- **Backgrounds:** the body backdrop is two large soft **radial glows** — blue from top-left (35% alpha), mint from top-right (22% alpha) — over `#0b1220`. No images, no patterns, no full-bleed photography. The glow is the only decoration.
- **Transparency & blur:** the signature. Cards are `rgba(15,26,46,.72)` with `backdrop-filter: blur(10px)`. Fields sit on `rgba(0,0,0,.22)`, toggles on `rgba(0,0,0,.14)`, ghost buttons on `rgba(0,0,0,.18)` — progressively lighter translucent blacks that read as depth.
- **Borders:** hairline `rgba(255,255,255,.10)` on cards; slightly softer on toggles (`.07`) and stronger on buttons (`.14`, `.25` on primary). White at low alpha, never a solid line.
- **Gradients:** exactly one gradient shape — `135deg, #5aa8ff → #7cf0c0`. Used at high saturation for the logo, and at `.95 → .6` alpha for the primary button (with near-black `#07101d` text). Never used as a page background.
- **Type:** system-UI sans stack, no webfonts. Title 16/700, sections 13/650, body 12–13, button 13/800, labels/hints 12 muted. Tight and dense for a small popup.
- **Radius:** `14px` on cards and buttons; `12px` on fields and toggle pills; `10px` on the 34px app icon. Consistent, medium-soft — never pill-round except the toolbar badge.
- **Elevation:** two shadows — `0 10px 30px rgba(0,0,0,.35)` for the logo/hero, `0 8px 22px rgba(0,0,0,.22)` for glass cards. Soft, low, diffuse.
- **Spacing:** `14px` popup edge padding; `10px` card padding and inter-card gap; `8px` intra-group gaps. A tight 2/6/8/10/14 rhythm.
- **Animation:** minimal and functional. Hover brightens a border over `.12s`; press nudges `translateY(1px)` over `.05s`. Easing `cubic-bezier(.2,.6,.2,1)`. No entrance animations, no bounce, no decorative loops.
- **Hover states:** border lightens (`.10 → .25` white), background barely lifts. Never a color shift or scale-up.
- **Press states:** a 1px downward nudge. No color change.
- **Focus:** a `#5aa8ff` @ 60% border (fields/toggles) or a 3px ring (buttons). Blue is the focus color everywhere.
- **Cards:** translucent + blurred + hairline-bordered + softly shadowed. That single recipe is every container in the product.

---

## Iconography

- **App icon (definitive):** the **"CU" monogram** in a rounded square on the `135°` blue→mint gradient, near-black `#07101d` letters, bold with tight tracking so both stay legible down to 16px. Source of truth is `assets/logo-cu.svg`; ship the rasterized `assets/icon-gradient-{16,32,48,128}.png`. This is the selected direction and is used across the whole system — header, favicon, and toolbar (see the *Brand* cards). The extension's original flat-navy PNGs (`icons/*.png`) are superseded by this gradient mark.
- **Toolbar treatments:** `toolbar-mono.svg` (single-color glyph for the browser bar) and `toolbar-badge.svg` (gradient tile with a green ✓ badge, mirroring the `#22c55e` badge the service worker paints after a successful copy).
- *A refined "cut-link + sparkle" concept was explored but not selected — the clean gradient monogram is the chosen mark.*
- **UI glyphs:** the product uses **almost no icons**. Toggles are native checkboxes (`accent-color: #5aa8ff`). The only symbols in-product are the ✓/! toolbar badge and the `…` ellipsis in rule labels. There is **no icon font and no icon set** — do not introduce one; it would break the minimal, text-led character of the UI.
- **Emoji:** not used in copy. The ✓ is a Unicode glyph rendered inside the badge, not decorative emoji.

> **Font note:** the system deliberately ships **no webfonts** — it uses the OS system-UI sans stack exactly as the extension does. Nothing to upload.

---

## Intentional additions

Everything maps to a real element in the source, with two brief-mandated additions:
- **BrandRow / Card / StatusLine / RemovedHint / ToolbarBadge** are named component wrappers around markup that exists inline in `popup.html` / `service_worker.js` — no new UI invented.
- The **gradient logo + toolbar SVGs** in `assets/` are the selected brand treatment (the shipped icon was a flat placeholder). The gradient mark is now used consistently across the popup header, favicon, and toolbar.
