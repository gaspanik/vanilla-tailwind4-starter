# Vite + Vanilla TypeScript + Tailwind CSS v4

ViteとTailwind CSS v4を使用したシンプルなVanilla TypeScriptプロジェクトのテンプレートです。

## 🚀 特徴

- ⚡️ [Vite](https://vitejs.dev/) - 高速な開発サーバーとビルドツール
- 🎨 [Tailwind CSS v4](https://tailwindcss.com/) - ユーティリティファーストのCSSフレームワーク
- 📦 [Lucide Icons](https://lucide.dev/) - 美しいオープンソースアイコンライブラリ
- 🔷 [TypeScript](https://www.typescriptlang.org/) - 型安全なJavaScript
- 📄 複数HTMLページ対応 - プロジェクトルートの全HTMLファイルを自動ビルド

## 📋 必要要件

- Node.js 22.x 以上

## 🛠️ セットアップ
`<pm>` はお使いのパッケージマネージャーに置き換えてください（例: `npm`, `yarn`, `pnpm`）。

### 依存関係のインストール

```bash
<pm> install
```

## 🏃 実行方法

### 開発サーバーの起動

```bash
<pm> run dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) を開きます。

### 本番用ビルド

```bash
<pm> run build
```

TypeScriptの型チェック後、ビルド結果は `dist` ディレクトリに出力されます。

### ビルドのプレビュー

```bash
<pm> run preview
```

## 📁 プロジェクト構成

```
vite-vanilla-ts-tailwind/
├── index.html         # トップページ
├── about.html         # Aboutページ
├── public/            # 静的ファイル
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/        # 画像などのアセット
│   ├── main.ts        # エントリーポイント
│   └── style.css      # Tailwind CSSのインポート
├── .claude/           # Claude Code 設定
│   ├── commands/figma/    # スラッシュコマンド
│   └── skills/figma-workflow/ # ワークフロースキル
├── tsconfig.json      # TypeScript設定
├── vite.config.ts     # Vite設定（マルチページビルド対応）
├── package.json       # 依存関係とスクリプト
└── README.md          # このファイル
```

## 🤖 AI コマンド

[Claude Code](https://claude.ai/code) と [GitHub Copilot](https://github.com/features/copilot)（VS Code）の両方で、Figma デザインをコードに変換するコマンドが利用できます。また、Figma を使わずに Tailwind CSS でUIモックアップを作成する `create-mockup` コマンドも利用できます。

### ワークフロー全体を一括実行

| | Claude Code | GitHub Copilot |
|---|---|---|
| コマンド | `/figma-workflow <Figma URL>` | `/figma-workflow <Figma URL>` |

実装 → レビューの2フェーズをサブエージェントが自動で順番に実行します。

> **注意**: 縦に長いランディングページなど大きなフレームは、セクション単位（Hero, Features, CTA など）に分割して実行してください。

### 使い分け

| シーン | Claude Code | GitHub Copilot |
|---|---|---|
| 初回（デモコンテンツをクリア） | `/figma:setup-env` | `/figma-setup-env` |
| Figma → コード（全自動） | `/figma-workflow <URL>` | `/figma-workflow <URL>` |
| 2ページ目以降 | `/figma-workflow <URL> about.html` | `/figma-workflow <URL> about.html` |
| 実装だけやり直したい | `/figma:implement-figma <URL>` | `/figma-implement-figma <URL>` |
| レビューだけやり直したい | `/figma:review-figma <URL>` | `/figma-review-figma <URL>` |
| UIモックアップを作成 | 自動（スキル） | `/create-mockup` |

### デザイントークン管理

Figma Variables と `src/style.css` の `@theme` トークンを双方向に同期するスキル、および `DESIGN.md` を生成するスキルです。

| スキル | 用途 |
|---|---|
| `/figma-to-tailwind-html <Figma URL>` | Figma Variables → `src/style.css` の `@theme` トークンに書き出す |
| `/tailwind-to-figma-html [Figma URL]` | `src/style.css` の `@theme` トークン → Figma Variables に書き出す |
| `/create-design-md-html [Figma URL]` | コードベースまたは Figma からデザイン仕様書 `DESIGN.md` を生成する |

`/tailwind-to-figma-html` と `/create-design-md-html` の引数は省略可能です。省略した場合、`/tailwind-to-figma-html` は新規 Figma ファイル「Design Tokens」を作成し、`/create-design-md-html` はコードベースを探索するかソースを選択するよう案内します。

### 標準フロー

**Claude Code:**

```
# 1. デモコンテンツをクリア（初回のみ）
/figma:setup-env

# 2. Figma デザインを実装してレビューまで自動実行
/figma-workflow <Figma URL>
```

**GitHub Copilot（VS Code）:**

```
# 1. デモコンテンツをクリア（初回のみ）
/figma-setup-env

# 2. Figma デザインを実装してレビューまで自動実行
/figma-workflow <Figma URL>
```

## 📄 マルチページビルド

このプロジェクトは複数のHTMLページを自動的にビルドするよう設定されています。

### HTMLページの追加方法

プロジェクトのルートディレクトリに新しいHTMLファイルを追加するだけで、自動的にビルド対象に含まれます：

```
vite-vanilla-ts-tailwind/
├── index.html
├── about.html
├── contact.html
└── ...
```

ビルド結果:
```
dist/
├── index.html
├── about.html
└── contact.html
```

### 仕組み

`vite.config.ts`で[glob](https://www.npmjs.com/package/glob)を使用して、プロジェクトルート直下の全ての`*.html`ファイルを検出し、Viteのマルチページビルドに登録しています。

```typescript
const files = glob.sync('*.html')
const input = Object.fromEntries(
  files.map((file) => [
    path.basename(file, '.html'),
    path.resolve(__dirname, file),
  ]),
)
```

開発時は通常通り各HTMLファイルに直接アクセスできます：
- `http://localhost:5173/` - index.html
- `http://localhost:5173/about.html` - about.html

## 🔷 TypeScript の使い方

エントリーポイントは `src/main.ts` です。`@` エイリアスで `src/` ディレクトリを参照できます：

```typescript
import { something } from '@/utils'
```

型チェックはビルド時に自動実行されます（`tsc && vite build`）。開発中に型エラーを確認したい場合：

```bash
<pm> exec tsc --noEmit
```

## 🎨 Tailwind CSS v4 の使い方

このプロジェクトではTailwind CSS v4を使用しています。v4では`@tailwindcss/vite`プラグインを使用するため、従来の`postcss.config.js`や`tailwind.config.js`は不要です。

### 設定ファイル

- **vite.config.ts** - Tailwind Viteプラグインを設定
- **src/style.css** - `@import "tailwindcss";`でTailwindをインポート

### HTMLでの使用例

```html
<div class="flex items-center gap-2">
  <h1 class="font-medium text-gray-900 text-2xl">Hello Tailwind!</h1>
  <p class="text-gray-600">ユーティリティクラスを使って簡単にスタイリング</p>
</div>
```

## 🎭 Lucide Icons の使い方

[Lucide](https://lucide.dev/)は、美しくカスタマイズ可能なオープンソースのアイコンライブラリです。このプロジェクトでは軽量な実装が可能です。

### 基本的な使い方

#### 1. TypeScriptでアイコンをインポート

使用したいアイコンを`src/main.ts`でインポートして初期化します：

```typescript
import { createIcons, IceCreamCone, Heart, Star } from 'lucide'

// 使用するアイコンだけをインポート（バンドルサイズを最小化）
createIcons({ 
  icons: { 
    IceCreamCone,
    Heart,
    Star
  } 
})
```

#### 2. HTMLで`data-lucide`属性を使用

HTMLで`data-lucide`属性を持つ要素を配置します：

```html
<i data-lucide="ice-cream-cone"></i>
<i data-lucide="heart"></i>
<i data-lucide="star"></i>
```

アイコン名はキャメルケースをケバブケースに変換します：
- `IceCreamCone` → `ice-cream-cone`
- `Heart` → `heart`
- `ArrowRight` → `arrow-right`

### アイコンのカスタマイズ

Tailwindのクラスでサイズや色を調整できます：

```html
<div class="flex items-center gap-2">
  <i data-lucide="heart" class="text-red-500 w-6 h-6"></i>
  <i data-lucide="star" class="text-yellow-400 w-8 h-8"></i>
</div>
```

### 利用可能なアイコン

[Lucide公式サイト](https://lucide.dev/icons/)で1,500以上のアイコンを検索できます。使用したいアイコンを見つけたら：

1. アイコン名をパスカルケースで`main.ts`にインポート
2. HTMLでケバブケースの名前を`data-lucide`属性に指定

## 📦 使用技術

- [Vite 8.x](https://vitejs.dev/)
- [TypeScript 6.x](https://www.typescriptlang.org/)
- [Tailwind CSS 4.x](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## 📝 ライセンス

MIT
