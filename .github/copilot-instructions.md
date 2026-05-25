---
applyTo: "**"
---

# プロジェクト概要

Vite + Vanilla TypeScript + Tailwind CSS v4 のマルチページアプリ。フレームワークなし—純粋な HTML、CSS、TypeScript で構成されている。

## アーキテクチャ

- **マルチページ**: ルートの `*.html` ファイルを Vite が自動検出してエントリーポイントに登録。新しいページは `.html` ファイルをルートに置くだけで追加できる
- **Tailwind CSS v4**: `@tailwindcss/vite` プラグインを使用。`tailwind.config.js`・`postcss.config.js` は不要。`src/style.css` の `@import "tailwindcss";` のみ
- **Lucide Icons**: ビルド時にツリーシェイキングされる。HTML で使うアイコンはすべて `src/main.ts` でインポートして登録が必要
- **パスエイリアス**: `@` → `./src`

## HTMLファイルの要件

すべての `.html` ファイルに必ず含める：

```html
<!-- <head> 内 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/all.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/display-all.css" />

<!-- <body> 末尾 -->
<script type="module" src="/src/main.ts"></script>
```

日本語ページには `lang="ja"` を使用する。

## Lucideアイコンの使い方

```ts
// src/main.ts — 使うアイコンをすべて登録する
import { createIcons, Menu, X } from 'lucide'
createIcons({ icons: { Menu, X } })
```

```html
<!-- HTML ではケバブケース -->
<i data-lucide="menu"></i>
```

## Tailwind CSS v4 ガイドライン

### やってはいけないこと

**v3 固有のユーティリティは生成・提案しないこと。** 以下の表に従って v4 の構文に置き換える：

| ❌ v3 の構文 | ✅ v4 の構文 |
|---|---|
| `space-x-*` / `space-y-*` | flex/grid + `gap-*` |
| `divide-*` | 個々の子要素にボーダー |
| `bg-opacity-*` | `bg-black/50` スラッシュ記法 |

```html
<!-- ❌ v3 の構文 -->
<div class="space-y-4">

<!-- ✅ v4 の構文 -->
<div class="flex flex-col gap-4">
```

### テーマ管理

デザイントークンは `src/style.css` の `@theme` ブロックで定義する。テーマ変数で実現可能な任意値（色・スペーシング等）は使わず、テーマ変数を使う：

```css
@theme {
  --color-primary: #294779;
}
```

```html
<!-- ❌ --> <p class="text-[#294779]">
<!-- ✅ --> <p class="text-primary">
```

### スペーシング

Tailwind の標準スケールを優先する（1単位 = 4px）：

- ✅ `gap-2`（8px）、`p-4`（16px）、`w-80`（320px）
- ❌ `gap-[8px]`、`p-[16px]`、`w-[320px]`

任意値は標準スケール・テーマ変数で実現できない場合のみ使用する。複数箇所で使うなら `@theme` に追加する。

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

プロジェクトルートに `DESIGN.md` が存在する場合は、UI の変更を実装する前に必ず読む。このファイルにはプロジェクトのデザイントークン（カラー・タイポグラフィ・スペーシング・ボーダー半径）とコンポーネントのガイドラインが記載されている。

## スタイリング方針

- Tailwind ファースト：CSS モジュールや外部 CSS ファイルは使わない
- クラスは HTML の `class` 属性に直接記述する

## コード規約

- インデント2スペース、LF、UTF-8
- `dist/` はコミット・リント対象外
