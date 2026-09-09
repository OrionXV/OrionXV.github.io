# Portfolio migration checks — 9 September 2026

## Build and content

- Jekyll 3.10 safe-mode build succeeds.
- A clean archive of the committed files also builds. The first publishing attempt exposed an overly broad ignore rule; it is now anchored to the root dependency directory, and regression checks require all theme and legacy files to be tracked.
- `node tests/site-check.mjs` verifies all 199 legacy pages/assets against the previous commit using Git's line-ending normalization.
- All 22 projects remain in their chosen order. Their descriptions and links are unchanged, except the website project now describes the Academic Pages migration.
- All 32 generated HTML pages and their local links, fragments, and assets are checked.
- No SGPO, Gridworld, demo biography, unrendered template syntax, or personal portrait appears in the new pages.

## Browser checks

- Reviewed the new theme at 1440, 768, and 375 pixel widths; no horizontal overflow on the inspected pages.
- Tested all five main navigation links, the mobile menu, project category jumps, a project detail page, the CV disclosure, and the Legacy link.
- Confirmed all 22 legacy carousel cards remain and the first page retains its order.
- No broken images on inspected pages.
- Sampled text contrast ratios range from 4.58:1 (small coral label) to 14.79:1 (masthead name). Targeted checks also cover image alternatives, one page h1, navigation labels, menu state, and a skip link.
- Reduced-motion and print styles are provided. No analytics or forms were added.

## Limits

This is a new visual design, so comparison against an existing screenshot baseline is inconclusive. The checks above are functional/visual smoke tests, not a full accessibility audit. Automated axe, screen-reader testing, console-log inspection, and production Core Web Vitals were not measured.
