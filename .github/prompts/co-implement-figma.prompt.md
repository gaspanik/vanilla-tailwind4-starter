---
description: Figma URLのデザインをVanilla HTML + TypeScript + Tailwind CSS v4で実装する
tools:
  - search/codebase
  - edit/editFiles
  - execute/getTerminalOutput
  - execute/runInTerminal
  - com.figma.mcp/mcp/get_design_context
  - com.figma.mcp/mcp/get_variable_defs
---

実装するFigma URLをチャットで指定してください。指定されたFigma URLのデザインを実装します。

Figma URLが無効またはアクセス不能な場合（`get_design_context` がエラーを返した場合）は、処理を中断してユーザーに正しいURLの再入力を求めること。

> **注意**: ターミナルコマンドを実行する際は **Bash** を使用すること。

## 手順

### 1. デザイン情報の取得

- `get_design_context` でデザインコンテキストとリファレンスコードを取得する
- `get_variable_defs` でデザイントークン（色、スペーシング等）を取得する
- アノテーションの内容を確認し、実装に必要な情報を把握する

### 2. 既存コードの確認

- ルートディレクトリの既存HTMLファイル（`*.html`）を確認し、ページ構成を把握する
- `src/style.css` の `@theme` ブロックで定義済みのトークンを確認する
- `src/main.ts` でインポート済みのLucideアイコンを確認する

### 3. 実装

以下のプロジェクトガイドライン（[copilot-instructions.md](../copilot-instructions.md)）に従って実装すること：

- Tailwind CSS v4 構文を使用（`space-x/y-*` 禁止 → `gap-*` + flex/grid）
- テーマ変数で実現可能な色・スペーシングは任意値を使わず `@theme` トークンを使用
- クラスは HTML の `class` 属性に直接記述（CSS モジュール・外部CSSファイル禁止）
- インデント2スペース、改行コードLF、文字コードUTF-8

**HTMLファイルの配置**

- 各ページはルートディレクトリに `.html` ファイルとして作成する（Viteが自動検出）
- `index.html` がトップページ、追加ページは `about.html` などの名前で作成する

**必須 `<head>` タグ**

すべてのHTMLファイルに必ず以下を含める：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/all.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/display-all.css" />
```

**必須 `<script>` タグ**

`<body>` 末尾に必ず含める：

```html
<script type="module" src="/src/main.ts"></script>
```

**スタイリング**

- Tailwind CSS v4 構文を使用する（`space-x/y-*` は使わず `gap-*` + flex/grid を使う）
- クラスは HTML の `class` 属性に直接記述する（CSS モジュールや外部CSSファイルは使わない）

**Lucideアイコン**

HTMLで使用するアイコンはすべて `src/main.ts` で明示的にインポートして登録する：

```ts
import { createIcons, Menu, X, ChevronDown } from 'lucide'
createIcons({ icons: { Menu, X, ChevronDown } })
```

HTMLではケバブケースで参照する：

```html
<i data-lucide="menu"></i>
```

**TypeScript**

- ページ固有のロジックは `src/main.ts` に記述するか、`src/` 配下に `.ts` ファイルとして分割する
- グローバルに使うスタイルは `src/style.css` の `@layer base` か `@theme` に追加する

**アクセシビリティ**

- セマンティックなHTMLタグを使用する（`header`, `main`, `section`, `nav`, `footer` 等）
- `aria-label`, `aria-expanded`, `aria-controls` 等の適切なARIA属性を付与する
- 画像には意味のある `alt` テキストを設定する

**デザイントークン**

- Figmaから取得したトークンが `@theme` に未定義の場合、`src/style.css` に追加する
- 任意値（`w-[42px]`）は最終手段として使用し、複数箇所で使う場合は `@theme` に追加する

**画像アセット**

Figma MCP の画像URL（`https://www.figma.com/api/mcp/asset/...`）は **7日間で失効** するため、必ずローカルに保存する。

- `src/assets/images/` に `webp` 形式でダウンロードし、内容を表す kebab-case で命名する

```bash
# 1枚ずつダウンロード
curl -s -o src/assets/images/<name>.webp "<figma-asset-url>"

# まとめてダウンロードする場合
curl -s -o src/assets/images/hero.webp    "<url1>" \
&& curl -s -o src/assets/images/card-1.webp "<url2>" \
&& curl -s -o src/assets/images/card-2.webp "<url3>"
```

- コード内では直接URLを埋め込まず、Viteの `new URL()` 構文で参照する（TypeScriptからアクセスする場合）
- HTMLから直接参照する場合は `/src/assets/images/<name>.webp` のパスを使用する

### 実装チェックリスト

実装を進める前に、以下をすべて確認すること：

- [ ] `<head>` に Gen Interface JP の `<link>` タグを含めた
- [ ] `<body>` 末尾に `<script type="module" src="/src/main.ts">` を含めた
- [ ] `src/main.ts` にHTMLで使うアイコンをすべて登録した
- [ ] Figma画像URLをローカル（`src/assets/images/`）に保存した
- [ ] Tailwind v3構文（`space-*`, `divide-*`）を使っていない
- [ ] `@theme` 未定義のトークンを追加した

### 4. 完了確認

実装完了後、以下を確認してメッセージに含める：

- 作成・変更したファイルの一覧
- 新たに `@theme` に追加したトークン（あれば）
- 追加登録したLucideアイコン（あれば）
- ダウンロードした画像ファイルの一覧（`src/assets/images/` に保存したもの）
- アノテーションで指定された要件をすべて満たしているか
