# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a static HTML/CSS/JS site — no build step, no package manager. To preview locally:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

**Bilingual page pairs.** Every page exists in two versions: an English file (e.g. `program-level-1-foundations.html`) and a Chinese counterpart with a `-zh` suffix (`program-level-1-foundations-zh.html`). The full list of paired pages is maintained in `js/language-switcher.js` under `bilingualEnPages`. When adding a new page, add both the EN and ZH files and register the EN filename in that array.

**Language switching** (`js/language-switcher.js`): On page load, reads `localStorage['preferred-language']` and redirects if the stored language differs from the current page's language. Also rewrites all in-page `<a href>` targets to stay in the current language, and wires the `.language-toggle` button to switch and persist the preference.

**Sidebar navigation** (`js/scripts.js`): StartBootstrap "Stylish Portfolio" theme logic — toggles `.active` on `#sidebar-wrapper`, swaps hamburger/X icons, and shows/hides a scroll-to-top button.

**Styling** (`css/styles.css`): Single stylesheet; includes Bootstrap and theme overrides. External dependencies (Bootstrap, Font Awesome, Simple Line Icons, Source Sans Pro) are loaded from CDNs in each page's `<head>`.

**Program content source of truth**: `Program_CSxResearch_EN.md` is the canonical English description of the four program levels (Foundations, Applied, VIP Capstone, Custom Pathway). HTML program pages are derived from it.

## Content conventions

- Page sections use `id` anchors matching the sidebar nav links (`#about`, `#services`, `#programs`, `#pricing`, `#faq`, `#contact`).
- Chinese pages (`lang="zh-CN"`) must mirror the structure and section IDs of their English counterparts so the language switcher's hash-preserving redirect lands correctly.
- The `.language-toggle` button label is `中文` on EN pages and `EN` on ZH pages.
