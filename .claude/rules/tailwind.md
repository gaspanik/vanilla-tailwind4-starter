---
paths:
  - "*.html"
  - "src/**/*.{ts,css}"
---

# Tailwind CSS v4 Rules

Runs via the `@tailwindcss/vite` plugin. Config is CSS-based — never create `tailwind.config.js`. Global styles live in `src/style.css` (`@import "tailwindcss"` plus `@theme` tokens).

## v4 syntax only

Never generate or suggest v3-specific utilities. Convert them when refactoring:

- ❌ `space-x-*` / `space-y-*` → ✅ combine `gap-*` with flex/grid
- ❌ `divide-*` → ✅ borders on individual children

## Values and tokens

- **Prefer the standard scale** (1 unit = 4px): `gap-2` (8px), `p-4` (16px), `w-80` (320px). Arbitrary values (`w-[42px]`) are a last resort for design-mandated exact values — add a `@theme` token if used more than once
- **Manage colors centrally as `@theme` tokens**: don't use Tailwind scale colors like `neutral-*` or `gray-*` directly — define purpose-specific tokens (dark background, hover, etc.):

```css
/* src/style.css */
@theme {
  --color-dark: #111111;
  --color-dark-hover: #262626;
  --color-muted: #666666;
  --color-muted-dark: #a3a3a3;   /* secondary text on dark backgrounds */
  --color-border: #e5e5e5;
  --color-border-dark: #404040;  /* borders on dark backgrounds */
}
```

```html
<!-- ❌ <p class="text-neutral-400">   →   ✅ <p class="text-muted-dark"> -->
```

- Use standard breakpoints for responsive design (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)

## Styling policy

- **Tailwind-first**: no CSS modules or external stylesheets — write classes directly in the HTML `class` attribute

## Font family

`--default-font-family` is applied to the body default via `@theme`, and `--heading-font-family` is already applied to h1–h6 via `@layer base` (both in `src/style.css`). Never write these redundant classes:

- `font-[var(--heading-font-family)]` / `font-(--heading-font-family)`
- `font-[var(--default-font-family)]` / `font-(--default-font-family)`

If a non-heading element (e.g. a logo `<a>`) needs the heading font, add a selector to `@layer base` or define a dedicated utility in `@theme`.

## Shared class consolidation (`*:` variant)

When 3+ sibling elements share 2+ classes, consolidate onto the parent with the `*:` variant (applies to direct children only, not grandchildren):

```html
<!-- ❌ Avoid -->
<ul>
  <li><a href="#about" class="hover:text-white">About</a></li>
  <li><a href="#works" class="hover:text-white">Works</a></li>
  <li><a href="#contact" class="hover:text-white">Contact</a></li>
</ul>

<!-- ✅ Correct -->
<ul class="*:hover:text-white">
  ...
</ul>
```

## Accessibility

- Prefer semantic tags over `div`/`span` where the role matches: `header`, `nav`, `main`, `section`, `article`, `footer`
- Every `<img>` needs `alt` — descriptive text for meaningful images, `alt=""` for purely decorative ones
- Every `<button>` needs an explicit `type="button"` (or `"submit"` for form submission). An omitted type defaults to `"submit"` inside `<form>`, a common source of bugs
- Every form input has an associated `<label for>` (or `aria-label` if visually hidden)
- Collapsible/menu buttons: set `aria-expanded`, `aria-controls`, and a descriptive `aria-label`
- Never write text in ALL CAPS directly in markup — write proper case and apply the `uppercase` class as a style (screen readers may spell out capitalized text letter by letter; brand names and proper nouns are exempt):

```html
<!-- ❌ <a href="#about">ABOUT</a> -->
<!-- ✅ <a href="#about" class="uppercase">About</a> -->
```
