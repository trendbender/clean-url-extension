---
name: clean-url-design
description: Use this skill to generate well-branded interfaces and assets for Clean URL (a privacy-first Chrome extension that strips tracking params from URLs), either for production or throwaway prototypes/mocks. Contains the design tokens, colors, type, glassmorphism recipe, brand assets, and UI-kit components for the 360px browser-action popup.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Tokens:** `styles.css` (entry) → `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`. Link `styles.css` and use the CSS custom properties (`var(--bg)`, `var(--grad-primary)`, `var(--card-glass)`, …).
- **Palette:** bg `#0b1220`, card `#0f1a2e`, text `#e9eefc`, muted `#97a7c8`, accent `#5aa8ff`, mint `#7cf0c0`, danger `#ff6b6b`, badge `#22c55e`. Two radial glows over the bg = the body backdrop.
- **Signature:** translucent blurred cards (`backdrop-filter: blur(10px)`, `rgba(15,26,46,.72)`), hairline white borders, one `135°` blue→mint gradient (logo + primary button), `#5aa8ff` focus. Radius 14 (cards/buttons) / 12 (fields/toggles).
- **Type:** system-UI sans, no webfonts. Title 16/700, body 12–13, button 13/800.
- **Components** (`window.CleanURLDesignSystem_814f5d`): Button, Toggle, UrlField, Card, BrandRow, StatusLine, RemovedHint, ToolbarBadge.
- **Assembled surface:** `ui_kits/popup/` — the 360px popup in 3 states + redlines.
- **Voice:** privacy-first, terse, imperative. Title Case buttons, sentence-case hints. No emoji. Tolerate long DE/RU strings (labels wrap).

Do not introduce an icon font or extra accent colors — the product is deliberately minimal and text-led.
