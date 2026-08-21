# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Detailed Tailwind CSS rules live in `.claude/rules/tailwind.md` and are loaded automatically.

## Commands

```bash
<pm> run dev       # Start dev server at http://localhost:5173
<pm> run build     # Type-check (tsc) then build for production into dist/
<pm> run preview   # Preview the production build
```

## Architecture

A Vite + Vanilla TypeScript + Tailwind CSS v4 multi-page app. No framework — plain HTML, CSS, and TypeScript.

- **Multi-page build**: `vite.config.ts` auto-discovers HTML files at the project root via `glob.sync('*.html')` and registers them as Rollup entry points. Add a new page by dropping an `.html` file at the root — no config changes needed
- **Tailwind CSS v4**: via the `@tailwindcss/vite` plugin (no `tailwind.config.js` or PostCSS needed). CSS entry point is `src/style.css` (`@import "tailwindcss"` plus `@theme` tokens)
- **Path alias**: `@` resolves to `./src`

## Lucide Icons

Icons are tree-shaken at build time, so every icon used in HTML must be explicitly imported and registered in `src/main.ts`:

```typescript
import { createIcons, IconName } from 'lucide'
createIcons({ icons: { IconName } })
```

Use kebab-case in HTML: `<i data-lucide="icon-name"></i>`

## HTML Page Requirements

Every HTML file should include:

- A `<link>` tag in `<head>` loading the CDN font ([Gen Interface JP](https://github.com/yamatoiizuka/gen-interface-jp)):

  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@0.8.0/cdn/all.css" />
  ```

- The entry-point script `<script type="module" src="/src/main.ts"></script>` at the end of `<body>`
- `lang="ja"` on Japanese-language pages

## Typography

`src/style.css` sets **Gen Interface JP** as the default typeface (`--default-font-family` / `--heading-font-family`), loaded via the CDN link documented above. Treat this as the starter's placeholder, not a fixed choice — swap it whenever the prompt names a different typeface, or a referenced Figma design specifies its own fonts.

## Design System

If `DESIGN.md` exists in the project root, always read it before implementing any UI change. It contains design tokens (colors, typography, spacing, border radius) and component guidelines.

## Code Conventions

- 2-space indent, LF line endings, UTF-8 encoding (see `.editorconfig`)
- `dist/` is not committed and is excluded from linting
