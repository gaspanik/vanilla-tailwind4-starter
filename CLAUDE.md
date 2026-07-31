# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

Tailwind CSS の詳細ルールは `.claude/rules/tailwind.md` にあります（自動ロードされます）。

## コマンド

```bash
<pm> run dev       # 開発サーバーを起動 http://localhost:5173
<pm> run build     # 型チェック (tsc) 後、dist/ へ本番ビルド
<pm> run preview   # 本番ビルドをプレビュー
```

## アーキテクチャ

Vite + Vanilla TypeScript + Tailwind CSS v4 のマルチページアプリです。フレームワークなし—純粋な HTML、CSS、TypeScript で構成されています。

- **マルチページビルド**: `vite.config.ts` が `glob.sync('*.html')` でプロジェクトルートの HTML ファイルを自動検出し、Rollup のエントリーポイントとして登録します。新しいページはルートに `.html` ファイルを置くだけで、設定変更は不要です
- **Tailwind CSS v4**: `@tailwindcss/vite` プラグインを使用（`tailwind.config.js` や PostCSS は不要）。CSS のエントリーは `src/style.css`（`@import "tailwindcss"` + `@theme` トークン）
- **パスエイリアス**: `@` は `./src` に解決されます

## Lucide Icons

ビルド時にツリーシェイキングされるため、HTML で使用するアイコンはすべて `src/main.ts` で明示的にインポートして登録する必要があります：

```typescript
import { createIcons, IconName } from 'lucide'
createIcons({ icons: { IconName } })
```

HTML ではケバブケースで使用します：`<i data-lucide="icon-name"></i>`

## HTML ページの要件

すべての HTML ファイルに以下を含めます：

- `<head>` 内に CDN フォント（[Gen Interface JP](https://github.com/yamatoiizuka/gen-interface-jp)）を読み込む `<link>` タグ：

  ```html
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@0.8.0/cdn/all.css" />
  ```

- `<body>` の末尾にエントリーポイントの `<script type="module" src="/src/main.ts"></script>`
- 日本語のページには `lang="ja"` を使用

## デザインシステム

プロジェクトルートに `DESIGN.md` が存在する場合は、UI の変更を実装する前に必ず読んでください。デザイントークン（カラー・タイポグラフィ・スペーシング・ボーダー半径）とコンポーネントのガイドラインが記載されています。

## コード規約

- インデント2スペース、改行コード LF、文字コード UTF-8（`.editorconfig` 参照）
- `dist/` はコミットせず、リントの対象外です
