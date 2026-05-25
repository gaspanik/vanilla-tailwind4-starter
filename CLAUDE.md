# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## コマンド

```bash
<pm> run dev       # 開発サーバーを起動 http://localhost:5173
<pm> run build     # 型チェック (tsc) 後、dist/ へ本番ビルド
<pm> run preview   # 本番ビルドをプレビュー
```

## アーキテクチャ

Vite + Vanilla TypeScript + Tailwind CSS v4 のマルチページアプリです。フレームワークなし—純粋な HTML、CSS、TypeScript で構成されています。

**マルチページビルド**: `vite.config.ts` が `glob.sync('*.html')` でプロジェクトルートの HTML ファイルを自動検出し、Rollup のエントリーポイントとして登録します。新しいページを追加するにはルートに `.html` ファイルを置くだけで、設定変更は不要です。

**Tailwind CSS v4**: `@tailwindcss/vite` プラグインを使用しています。`tailwind.config.js` や `postcss.config.js` は不要です。CSS のエントリーは `src/style.css` に書かれた `@import "tailwindcss";` の1行のみです。

**Lucide Icons**: ビルド時にツリーシェイキングされます。HTML で使用するアイコンはすべて `src/main.ts` で明示的にインポートして登録する必要があります：
```typescript
import { createIcons, IconName } from 'lucide'
createIcons({ icons: { IconName } })
```
HTML ではケバブケースで使用します：`<i data-lucide="icon-name"></i>`

**パスエイリアス**: `@` は `./src` に解決されます。

## Tailwind CSS v4 ガイドライン

### 基本原則

- **設定ファイル不要**: `tailwind.config.js` は作成しない。`src/style.css` の `@import "tailwindcss";` のみで動作します
- **Vite プラグイン**: `@tailwindcss/vite` を使用（PostCSS は不要）
- **カスタマイズ**: JS 設定ではなく `@theme` ディレクティブで行う

### テーマ管理

プロジェクト固有のデザイントークンは `src/style.css` の `@theme` ブロックで定義します：

```css
@import "tailwindcss";

@theme {
  --color-primary: #294779;
  --color-secondary: #f59e0b;
}
```

任意値（`text-[#294779]`）ではなく、テーマ変数（`text-primary`）を使用してください。

### スペーシング・数値のガイドライン

- **標準スケールを優先**: Tailwind のスペーシングスケール（1単位 = 4px）を使います
  - ✅ 良い例: `gap-2`（8px）、`p-4`（16px）、`m-6`（24px）、`w-80`（320px）
  - ❌ 避ける: `gap-[8px]`、`p-[16px]`、`w-[320px]`
- **任意値は最終手段**: 標準スケールやテーマ変数で実現できない場合のみ `[...]` 構文を使用
  - 許容例: `w-[42px]`（デザイン上どうしても必要な場合）
  - より良い方法: 複数箇所で使うなら `@theme` に追加する
- **レスポンシブ**: 標準ブレークポイント（`sm:`、`md:`、`lg:`、`xl:`、`2xl:`）を使用

### v4 のクラス名変更（重要）

Tailwind CSS v4 ではクラス名の命名規則が更新されています。**必ず v4 の構文を使用**してください：

```html
<!-- ❌ 誤り（v3 の構文） -->
<div class="space-y-4">

<!-- ✅ 正しい（v4 の構文） -->
<div class="flex flex-col gap-4">
```

**主な変更点:**
- ❌ `space-x-*` / `space-y-*` → ✅ flex/grid と `gap-*` を組み合わせる
- ❌ `divide-*` → ✅ 個々の子要素にボーダーを付ける
- ✅ そのまま使えるクラス: `flex`、`grid`、`p-*`、`m-*`、`w-*`、`h-*` など
- ✅ レスポンシブ: `sm:`、`md:`、`lg:`、`xl:`、`2xl:`
- ✅ 状態バリアント: `hover:`、`focus:`、`active:`、`disabled:` など

**v3 固有のユーティリティは生成・提案しない**こと。リファクタリング時は非推奨ユーティリティを flex/grid パターンに変換してください。

### スタイリング方針

- **Tailwind ファースト**: CSS モジュールや外部 CSS は使わない
- **クラスは HTML の `class` 属性に直接記述**する

### 大文字テキストの表示

HTMLに直接大文字で書かず、`uppercase` クラスでスタイルとして適用する。テキスト自体は先頭大文字・残り小文字で記述。

```html
<!-- ❌ 避ける -->
<a href="#about">ABOUT</a>

<!-- ✅ 正しい -->
<a href="#about" class="uppercase">About</a>
```

スクリーンリーダーが大文字を1文字ずつ読み上げるのを防ぐため。ブランド名などの固有名詞はそのままでよい。

### 共有クラスの集約（`*:` バリアント）

3つ以上の兄弟要素が同じクラスを2つ以上持つ場合、親要素に `*:` バリアントでまとめる。

```html
<!-- ❌ 避ける -->
<ul>
  <li><a href="#about" class="hover:text-white">About</a></li>
  <li><a href="#works" class="hover:text-white">Works</a></li>
  <li><a href="#contact" class="hover:text-white">Contact</a></li>
</ul>

<!-- ✅ 正しい -->
<ul class="*:hover:text-white">
  <li><a href="#about">About</a></li>
  <li><a href="#works">Works</a></li>
  <li><a href="#contact">Contact</a></li>
</ul>
```

`*:` は直接の子要素にのみ適用される（孫要素には影響しない）。

### カラートークンの一元管理

`neutral-*` や `gray-*` などの Tailwind スケールを直接使わず、プロジェクト固有の色はすべて `@theme` トークンとして定義する。ダーク背景用・ホバー用など用途別にトークンを分けて定義すること。

```css
/* ✅ src/style.css */
@theme {
  --color-dark: #111111;
  --color-dark-hover: #262626;
  --color-muted: #666666;
  --color-muted-dark: #a3a3a3;   /* ダーク背景上のサブテキスト */
  --color-border: #e5e5e5;
  --color-border-dark: #404040;  /* ダーク背景上のボーダー */
}
```

```html
<!-- ❌ 避ける -->
<p class="text-neutral-400">...</p>
<div class="border-neutral-800">...</div>

<!-- ✅ 正しい -->
<p class="text-muted-dark">...</p>
<div class="border-border-dark">...</div>
```

## デザインシステム

プロジェクトルートに `DESIGN.md` が存在する場合は、UI の変更を実装する前に必ず読んでください。このファイルにはプロジェクトのデザイントークン（カラー・タイポグラフィ・スペーシング・ボーダー半径）とコンポーネントのガイドラインが記載されています。

## コード規約

- インデント2スペース、改行コード LF、文字コード UTF-8（`.editorconfig` 参照）
- `dist/` はコミットせず、リントの対象外です

## HTML ページの要件

すべての HTML ファイルに以下を含める必要があります：

`<head>` 内に CDN フォント（[Gen Interface JP](https://github.com/yamatoiizuka/gen-interface-jp)）を読み込む `<link>` タグ：
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/all.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/display-all.css" />
```

`<body>` の末尾にエントリーポイントの `<script>` タグ：
```html
<script type="module" src="/src/main.ts"></script>
```

日本語のページには `lang="ja"` を使用してください。
