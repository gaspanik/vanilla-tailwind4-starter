# Vite + Vanilla TypeScript + Tailwind CSS v4

A simple Vanilla TypeScript project template using Vite and Tailwind CSS v4.

## 🚀 Features

- ⚡️ [Vite](https://vitejs.dev/) - fast dev server and build tool
- 🎨 [Tailwind CSS v4](https://tailwindcss.com/) - utility-first CSS framework
- 📦 [Lucide Icons](https://lucide.dev/) - a beautiful open-source icon library
- 🔷 [TypeScript](https://www.typescriptlang.org/) - type-safe JavaScript
- 📄 Multi-page HTML support - automatically builds every HTML file at the project root

## 📋 Requirements

- Node.js 22.x or later

## 🛠️ Setup
Replace `<pm>` with your package manager (e.g. `npm`, `yarn`, `pnpm`).

### Install dependencies

```bash
<pm> install
```

## 🏃 Running

### Start the dev server

```bash
<pm> run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production build

```bash
<pm> run build
```

After a TypeScript type check, the build output is written to the `dist` directory.

### Preview the build

```bash
<pm> run preview
```

## 📁 Project Structure

```
vanilla-tailwind4-starter/
├── index.html         # Top page
├── about.html         # About page
├── public/            # Static files
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/        # Assets such as images
│   ├── main.ts        # Entry point
│   └── style.css      # Tailwind CSS import
├── .claude/           # Claude Code config
│   ├── commands/      # Slash commands
│   └── skills/        # Skills
├── .github/           # GitHub config
│   ├── prompts/           # Copilot custom prompts
│   └── copilot-instructions.md # Copilot instruction file
├── CLAUDE.md          # Claude Code project instructions
├── tsconfig.json      # TypeScript config
├── vite.config.ts     # Vite config (multi-page build support)
├── package.json       # Dependencies and scripts
├── .editorconfig      # Editor config
├── .gitignore
└── README.md          # This file
```

## 🤖 AI Commands

Commands for converting Figma designs into code are available in both [Claude Code](https://claude.ai/code) and [GitHub Copilot](https://github.com/features/copilot) (VS Code). A `create-mockup` command is also available for building Tailwind CSS UI mockups without Figma.

> **💡 Delete whichever directory you don't need, based on the agent you use:**
> - Claude Code only → delete `.github/prompts/`
> - GitHub Copilot only → delete `.claude/`

### Which command to use

| Scenario | Claude Code | GitHub Copilot |
|---|---|---|
| First run (clear demo content) | `/figma:setup-env` | `/co-setup-env` |
| Redo implementation only | `/figma:implement-figma <URL>` | `/co-implement-figma <URL>` |
| Redo review only | `/figma:review-figma <URL>` | `/co-review-figma <URL>` |
| Create a UI mockup | Automatic (skill) | `/co-create-mockup` |

### Design token management

Skills that bidirectionally sync Figma Variables with the `@theme` tokens in `src/style.css`, and a skill that generates `DESIGN.md`.

| Skill | Purpose |
|---|---|
| `/figma-to-tailwind-html <Figma URL>` | Export Figma Variables into `@theme` tokens in `src/style.css` |
| `/tailwind-to-figma-html [Figma URL]` | Export `@theme` tokens from `src/style.css` into Figma Variables |
| `/create-design-md-html [Figma URL]` | Generate a `DESIGN.md` design spec from the codebase or from Figma |

The arguments to `/tailwind-to-figma-html` and `/create-design-md-html` are optional. If omitted, `/tailwind-to-figma-html` creates a new Figma file named "Design Tokens", and `/create-design-md-html` prompts you to either explore the codebase or choose a source.

### Standard flow

**Claude Code:**

```
# 1. Clear demo content (first run only)
/figma:setup-env

# 2. Implement the Figma design
/figma:implement-figma <Figma URL>

# 3. Compare the implementation against the design and fix it
/figma:review-figma <Figma URL>
```

**GitHub Copilot (VS Code):**

```
# 1. Clear demo content (first run only)
/co-setup-env

# 2. Implement the Figma design
/co-implement-figma <Figma URL>

# 3. Compare the implementation against the design and fix it
/co-review-figma <Figma URL>
```

## 📄 Multi-page Build

This project is configured to automatically build multiple HTML pages.

### Adding an HTML page

Just add a new HTML file to the project root directory, and it's automatically included in the build:

```
vanilla-tailwind4-starter/
├── index.html
├── about.html
├── contact.html
└── ...
```

Build output:
```
dist/
├── index.html
├── about.html
└── contact.html
```

### How it works

`vite.config.ts` uses [glob](https://www.npmjs.com/package/glob) to detect every `*.html` file directly under the project root and registers them with Vite's multi-page build.

```typescript
const files = glob.sync('*.html')
const input = Object.fromEntries(
  files.map((file) => [
    path.basename(file, '.html'),
    path.resolve(__dirname, file),
  ]),
)
```

During development you can access each HTML file directly as usual:
- `http://localhost:5173/` - index.html
- `http://localhost:5173/about.html` - about.html

## 🔷 Using TypeScript

The entry point is `src/main.ts`. The `@` alias refers to the `src/` directory:

```typescript
import { something } from '@/utils'
```

Type checking runs automatically at build time (`tsc && vite build`). To check for type errors during development:

```bash
<pm> exec tsc --noEmit
```

## 🎨 Using Tailwind CSS v4

This project uses Tailwind CSS v4. Since v4 uses the `@tailwindcss/vite` plugin, the traditional `postcss.config.js` and `tailwind.config.js` are not needed.

### Config files

- **vite.config.ts** - configures the Tailwind Vite plugin
- **src/style.css** - imports Tailwind via `@import "tailwindcss";`

### Example usage in HTML

```html
<div class="flex items-center gap-2">
  <h1 class="font-medium text-neutral-900 text-2xl">Hello Tailwind!</h1>
  <p class="text-neutral-600">Easy styling with utility classes</p>
</div>
```

## 🎭 Using Lucide Icons

[Lucide](https://lucide.dev/) is a beautiful, customizable open-source icon library. This project supports a lightweight implementation.

### Basic usage

#### 1. Import icons in TypeScript

Import and initialize the icons you want to use in `src/main.ts`:

```typescript
import { createIcons, IceCreamCone, Heart, Star } from 'lucide'

// Import only the icons you use (minimizes bundle size)
createIcons({ 
  icons: { 
    IceCreamCone,
    Heart,
    Star
  } 
})
```

#### 2. Use the `data-lucide` attribute in HTML

Place elements with a `data-lucide` attribute in your HTML:

```html
<i data-lucide="ice-cream-cone"></i>
<i data-lucide="heart"></i>
<i data-lucide="star"></i>
```

Icon names are converted from PascalCase to kebab-case:
- `IceCreamCone` → `ice-cream-cone`
- `Heart` → `heart`
- `ArrowRight` → `arrow-right`

### Customizing icons

Adjust size and color with Tailwind classes:

```html
<div class="flex items-center gap-2">
  <i data-lucide="heart" class="text-red-500 w-6 h-6"></i>
  <i data-lucide="star" class="text-yellow-400 w-8 h-8"></i>
</div>
```

### Available icons

Search over 1,500 icons on the [Lucide website](https://lucide.dev/icons/). Once you find one you want to use:

1. Import the icon name in PascalCase in `main.ts`
2. Specify the kebab-case name in the `data-lucide` attribute in HTML

## 📦 Tech Used

- [Vite 8.x](https://vitejs.dev/)
- [TypeScript 7.x](https://www.typescriptlang.org/)
- [Tailwind CSS 4.x](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## 📝 License

MIT
