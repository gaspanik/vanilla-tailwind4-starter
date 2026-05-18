以下のFigma URLのデザインを実装してください：$ARGUMENTS

## 手順

### 0. 実装先ファイルの確認

`$ARGUMENTS` にファイル名（例: `about.html`）が含まれていない場合、実装を開始する前にユーザーに確認する：

> 実装先のHTMLファイル名を教えてください（例: `index.html`, `about.html`）

- 既存ファイルへの実装か、新規ファイルの作成かも確認する
- 新規ファイルの場合、CLAUDE.md の「HTML ページの要件」に従ったテンプレートで作成する

### 1. デザイン情報の取得
- `get_design_context` でデザインコンテキストとリファレンスコードを取得する
- `get_variable_defs` でデザイントークン（色、スペーシング等）を取得する
- ファイル中のアノテーションの内容を確認し、実装に必要な情報を把握する

### 2. 既存コードの確認
- `src/style.css` の `@theme` ブロックで定義済みのトークンを確認する
- `src/main.ts` で登録済みの Lucide アイコンを確認する

### 3. 実装
CLAUDE.md のガイドラインに厳密に従って実装すること：

**HTML 構造**
- 実装対象のページ（`index.html` 等）の `<body>` 内に直接マークアップする
- セマンティックなHTMLタグを使用する（`header`, `main`, `footer`, `section`, `nav` 等）
- 画像には意味のある `alt` テキストを設定する

**スタイリング**
- Tailwind CSS v4 構文を使用（`space-x/y-*` は使わず `gap-*` + flex/grid を使う）
- クラスは HTML の `class` 属性に直接記述する
- CSS モジュールや外部 CSS は使わない

**デザイントークン**
- Figmaから取得したトークンが `@theme` に未定義の場合、`src/style.css` に追加する
- 任意値（`w-[42px]`）は最終手段として使用し、複数箇所で使う場合は `@theme` に追加する

**アイコン**
- アイコンは Lucide を使用する
- `src/main.ts` で使用するアイコンをインポートして `createIcons()` に登録する：
  ```typescript
  import { createIcons, IconName } from 'lucide'
  createIcons({ icons: { IconName } })
  ```
- HTML では kebab-case で指定する：`<i data-lucide="icon-name"></i>`

**画像アセット**
- Figma MCP の画像URL（`https://www.figma.com/api/mcp/asset/...`）は **7日間で失効** するため、必ずローカルに保存する
- `public/images/` に `webp` 形式でダウンロードし、内容を表す kebab-case で命名する
  ```bash
  # 1枚ずつダウンロード
  curl -s -o public/images/<name>.webp "<figma-asset-url>"

  # まとめてダウンロードする場合
  curl -s -o public/images/hero.webp    "<url1>" \
  && curl -s -o public/images/card-1.webp "<url2>" \
  && curl -s -o public/images/card-2.webp "<url3>"
  ```
- コード内では直接URLを埋め込まず、ルート相対パスで参照する：
  ```html
  <!-- ❌ 直接URLを使わない -->
  <img src="https://www.figma.com/api/mcp/asset/..." alt="..." />

  <!-- ✅ ローカルパスで参照する -->
  <img src="/images/hero.webp" alt="..." />
  ```

### 4. 完了確認
実装完了後、以下を確認してメッセージに含める：
- 作成・変更したファイルの一覧
- 新たに `@theme` に追加したトークン（あれば）
- `src/main.ts` に追加した Lucide アイコン（あれば）
- ダウンロードした画像ファイルの一覧（`public/images/` に保存したもの）
- アノテーションで指定された要件をすべて満たしているか
