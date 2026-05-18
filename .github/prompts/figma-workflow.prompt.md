---
description: Figma URLのデザインを実装し、続けてレビュー・修正まで一貫して行う
tools:
  - search/codebase
  - edit/editFiles
  - execute/getTerminalOutput
  - execute/runInTerminal
  - com.figma.mcp/mcp/get_design_context
  - com.figma.mcp/mcp/get_variable_defs
  - com.figma.mcp/mcp/get_screenshot
---

実装するFigma URLをチャットで指定してください。**Phase 1（実装）→ Phase 2（レビュー・修正）** の順に実行します。

Figma URLが無効またはアクセス不能な場合（`get_design_context` がエラーを返した場合）は、処理を中断してユーザーに正しいURLの再入力を求めること。

> **注意**: ターミナルコマンドを実行する際は **Bash** を使用すること。

---

## Phase 1: 実装

### 1. 実装先ファイルの確認

URLにファイル名（例: `about.html`）が含まれていない場合、実装を開始する前にユーザーに確認する：

> 実装先のHTMLファイル名を教えてください（例: `index.html`, `about.html`）

- 既存ファイルへの実装か、新規ファイルの作成かも確認する
- 新規ファイルの場合、[copilot-instructions.md](../copilot-instructions.md) の「HTMLファイルの要件」に従ったテンプレートで作成する

### 2. デザイン情報の取得

- `get_design_context` でデザインコンテキストとリファレンスコードを取得する
- `get_variable_defs` でデザイントークン（色、スペーシング等）を取得する
- アノテーションの内容を確認し、実装に必要な情報を把握する

### 3. 既存コードの確認

- `src/style.css` の `@theme` ブロックで定義済みのトークンを確認する
- `src/main.ts` で登録済みの Lucide アイコンを確認する

### 4. 実装

以下のプロジェクトガイドライン（[copilot-instructions.md](../copilot-instructions.md)）に従って実装すること：

- Tailwind CSS v4 構文を使用（`space-x/y-*` 禁止 → `gap-*` + flex/grid）
- テーマ変数で実現可能な色・スペーシングは任意値を使わず `@theme` トークンを使用
- クラスは HTML の `class` 属性に直接記述（CSS モジュール・外部CSSファイル禁止）
- インデント2スペース、LF、UTF-8

**HTML 構造**

- 実装対象ページの `<body>` 内に直接マークアップする
- セマンティックなHTMLタグを使用する（`header`, `main`, `footer`, `section`, `nav` 等）
- 画像には意味のある `alt` テキストを設定する

**デザイントークン**

- Figmaから取得したトークンが `@theme` に未定義の場合、`src/style.css` に追加する
- 任意値（`w-[42px]`）は最終手段として使用し、複数箇所で使う場合は `@theme` に追加する

**Lucideアイコン**

HTMLで使用するアイコンはすべて `src/main.ts` で明示的にインポートして登録する：

```ts
import { createIcons, Menu, X } from 'lucide'
createIcons({ icons: { Menu, X } })
```

HTMLではケバブケースで参照する：`<i data-lucide="menu"></i>`

**画像アセット**

Figma MCP の画像URL（`https://www.figma.com/api/mcp/asset/...`）は **7日間で失効** するため、必ずローカルに保存する。

- `public/images/` に `webp` 形式でダウンロードし、内容を表す kebab-case で命名する

```bash
curl -s -o public/images/<name>.webp "<figma-asset-url>"
```

- コード内では直接URLを埋め込まず、ルート相対パスで参照する

```html
<!-- ❌ --> <img src="https://www.figma.com/api/mcp/asset/..." />
<!-- ✅ --> <img src="/images/hero.webp" alt="..." />
```

### 5. 実装チェックリスト

Phase 2 に進む前に以下をすべて確認すること：

- [ ] `<head>` に Gen Interface JP の `<link>` タグを含めた
- [ ] `<body>` 末尾に `<script type="module" src="/src/main.ts">` を含めた
- [ ] `src/main.ts` にHTMLで使うアイコンをすべて登録した
- [ ] Figma画像URLを `public/images/` にローカル保存した
- [ ] Tailwind v3構文（`space-*`, `divide-*`）を使っていない
- [ ] `@theme` 未定義のトークンを追加した

### 6. Phase 1 完了報告

- 作成・変更したファイルの一覧
- 新たに `@theme` に追加したトークン（あれば）
- 追加登録したLucideアイコン（あれば）
- ダウンロードした画像ファイルの一覧（あれば）

---

## Phase 2: レビューと修正

Phase 1 の完了を確認してから開始すること。

### 1. Figmaのスクリーンショット取得

- `get_screenshot` で対象ノードのスクリーンショットを取得する
- スクリーンショットを参照しながら実装との視覚的差異を特定する

### 2. 視覚的差異の確認と修正

スクリーンショットと実装を比較して、以下の順に確認・修正する（優先度順）：

1. **レイアウト**（最優先）
   - 要素の配置・整列（flex/grid の方向、justify/align の設定）
   - スペーシング（padding, margin, gap の値）
   - サイズ（幅・高さ）
2. **スタイル**
   - 色（`@theme` トークンまたはTailwindのカラーパレット）
   - タイポグラフィ（フォントサイズ、ウェイト、行間）
   - 角丸（border-radius）、シャドウ（box-shadow）、ボーダー
3. **レスポンシブ**
   - モバイル（`sm:`）・タブレット（`md:`）・デスクトップ（`lg:`）での見た目

### 3. ビルドエラーの確認

下記の `<pm>` はお使いのパッケージマネージャ（`npm`・`yarn`・`pnpm` など）に読み替えてください。

```bash
<pm> run build
```

を実行してTypeScriptのエラーをすべて解消する。よくある問題：

- 未使用のインポートや変数
- Lucideアイコンのインポート漏れ（HTMLで `data-lucide` を使っているのに `src/main.ts` に登録されていない）

### 4. アクセシビリティの確認

- セマンティックなHTMLタグが使われているか（`header`, `main`, `nav` 等）
- 画像に意味のある `alt` テキストがあるか
- 色コントラストがWCAG AA基準（4.5:1）を満たしているか

---

## 最終報告

両フェーズ完了後、以下の形式でまとめて報告する：

### Phase 1: 実装
[実装内容の要約]

### Phase 2: レビュー
[修正内容の要約・残課題があれば明記]
