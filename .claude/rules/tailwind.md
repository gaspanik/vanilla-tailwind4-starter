---
paths:
  - "*.html"
  - "src/**/*.{ts,css}"
---

# Tailwind CSS v4 ルール

`@tailwindcss/vite` プラグインで動作します。設定は CSS ベース — `tailwind.config.js` は作成しないこと。グローバルスタイルは `src/style.css`（`@import "tailwindcss"` + `@theme` トークン）。

## v4 構文のみ使用する

v3 固有のユーティリティは生成・提案しない。リファクタリング時は変換すること：

- ❌ `space-x-*` / `space-y-*` → ✅ flex/grid と `gap-*` を組み合わせる
- ❌ `divide-*` → ✅ 個々の子要素にボーダーを付ける

## 数値とトークン

- **標準スケールを優先**（1単位 = 4px）：`gap-2`（8px）、`p-4`（16px）、`w-80`（320px）。任意値（`w-[42px]`）はデザイン上どうしても必要な場合の最終手段で、複数箇所で使うなら `@theme` トークンに追加する
- **カラーは `@theme` トークンで一元管理**：`neutral-*` や `gray-*` などの Tailwind スケールを直接使わず、ダーク背景用・ホバー用など用途別にトークンを定義する：

```css
/* src/style.css */
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
<!-- ❌ <p class="text-neutral-400">   →   ✅ <p class="text-muted-dark"> -->
```

- レスポンシブは標準ブレークポイント（`sm:`、`md:`、`lg:`、`xl:`、`2xl:`）を使用

## スタイリング方針

- **Tailwind ファースト**：CSS モジュールや外部 CSS は使わず、クラスは HTML の `class` 属性に直接記述する

## フォントファミリー

`--default-font-family` は `@theme` で body のデフォルトに、`--heading-font-family` は `@layer base` で h1–h6 に適用済みです（いずれも `src/style.css`）。以下のクラスは冗長なので書かないこと：

- `font-[var(--heading-font-family)]` / `font-(--heading-font-family)`
- `font-[var(--default-font-family)]` / `font-(--default-font-family)`

見出し以外の要素（ロゴの `<a>` など）に見出しフォントが必要な場合は、`@layer base` にセレクタを追加するか `@theme` に専用ユーティリティを定義する。

## 共有クラスの集約（`*:` バリアント）

3つ以上の兄弟要素が同じクラスを2つ以上持つ場合、親要素に `*:` バリアントでまとめる（直接の子要素にのみ適用、孫要素には影響しない）：

```html
<!-- ❌ 避ける -->
<ul>
  <li><a href="#about" class="hover:text-white">About</a></li>
  <li><a href="#works" class="hover:text-white">Works</a></li>
  <li><a href="#contact" class="hover:text-white">Contact</a></li>
</ul>

<!-- ✅ 正しい -->
<ul class="*:hover:text-white">
  ...
</ul>
```

## アクセシビリティ

- 役割が合致する場合は `div`/`span` より意味を持つタグを優先する：`header`、`nav`、`main`、`section`、`article`、`footer`
- `<img>` には必ず `alt` を付ける。意味のある画像は説明的なテキストを、装飾目的のみの画像は `alt=""` を指定する
- `<button>` には必ず明示的な `type="button"` を付ける（フォーム送信用なら `"submit"`）。`type` 省略時は `<form>` 内で `"submit"` 扱いになりバグの原因になりやすい
- フォームの入力要素には対応する `<label for>` を付ける（視覚的に隠す場合は `aria-label`）
- 開閉式メニューボタンには `aria-expanded`、`aria-controls`、説明的な `aria-label` を設定する
- HTML に直接大文字で書かず、`uppercase` クラスでスタイルとして適用する。テキスト自体は先頭大文字・残り小文字で記述（スクリーンリーダーが1文字ずつ読み上げるのを防ぐため。ブランド名などの固有名詞はそのままでよい）：

```html
<!-- ❌ <a href="#about">ABOUT</a> -->
<!-- ✅ <a href="#about" class="uppercase">About</a> -->
```
