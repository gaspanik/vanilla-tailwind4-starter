---
description: UIモックアップを作成する。Figma URLなしでUIを一から実装したい場合に使う
tools:
  - search/codebase
  - edit/editFiles
  - execute/getTerminalOutput
  - execute/runInTerminal
---

ユーザーの要件をヒアリングして、プロジェクトの技術スタック（Vite + Vanilla TypeScript + Tailwind CSS v4）に沿ったUIモックアップを実装します。

> **注意**: ターミナルコマンドは Bash で実行する。

---

## Step 1: サイト・アプリの種類を確認する

まず、何を作りたいか聞く。一問一答で進めると UX がいいので、最初の質問はこれだけでいい：

> 「どんなサイト・アプリの画面を作りたいですか？（例：ECサイト、コーポレートサイト、LP、ブログ、ポートフォリオなど）」

ユーザーの回答から用途・ターゲットユーザー・コンテンツの大まかなイメージを把握する。

---

## Step 2: デザインテイストを確認する

次にデザインの方向性を確認する：

> 「デザインのイメージを教えてください：
> - カラー：ブランドカラーや使いたい色はありますか？（なければ「おまかせ」でも可）
> - テイスト：モダン・ミニマル・ナチュラル・ビビッド・クラシックなど、雰囲気のイメージは？
> - 参考サイトや気になるデザインがあれば教えてください（なくてもOK）
> - 画像素材：Unsplash などの無償素材を使いますか？それともプレースホルダー（背景色のみ）で進めますか？」

ユーザーが「おまかせ」と言った場合は、Step 1 で聞いたサイト種別に合わせて適切なカラーとテイストを自分で決め、決定内容をユーザーに一言伝えてそのまま実装に進む（承認を待つ必要はない）。画像についても未回答の場合はプレースホルダーで進める。

### カラーを決めたら @theme に定義する

ユーザーまたは自分で決めたカラーは `src/style.css` の `@theme` ブロックに追加する：

```css
@import "tailwindcss";

@theme {
  --color-primary: #2C4A7C;
  --color-secondary: #F4A261;
  --color-accent: #E76F51;
  --color-surface: #FAF7F2;
}
```

`tailwind.config.js` は使わない（Tailwind CSS v4 のルール）。

**⚠️ 色名の命名規則 — Tailwind 組み込みユーティリティとの衝突を避ける**

`--color-<name>` の `<name>` に以下を使うと、既存の Tailwind ユーティリティ（フォントサイズ・ブレークポイント等）と名前が衝突してクラスの意味が曖昧になる。**必ず避けること:**

| 避けるべき名前 | 衝突するユーティリティ |
|---|---|
| `base` | `text-base`（font-size: 1rem）|
| `sm` / `md` / `lg` / `xl` | レスポンシブブレークポイント |
| `full` / `auto` / `none` | `w-full`, `m-auto` 等 |
| `inherit` / `current` / `transparent` | CSS キーワード |

これらの代わりに `surface`, `canvas`, `paper`, `cream`, `dark`, `light` など、Tailwind ユーティリティと衝突しない意味の明確な名前を使う。

---

## Step 3: ページ種別と優先順位を確認する

どのページを作るか確認する：

> 「どのページを作りますか？複数ある場合は優先順位も教えてください。
> - トップページ（ヒーロー・特徴・CTA など複数セクション）
> - 商品一覧 / 詳細ページ
> - 記事一覧 / 詳細ページ
> - フォーム（お問い合わせ・サインアップなど）
> - その他（具体的に）」

ページが複数ある場合は1ページずつ実装し、完成したら次を聞くスタイルにする。

---

## Step 4: クリーンアップの確認

`index.html` のデモコンテンツが残っている場合は、実装前のクリーンアップとして [figma-setup-env](figma-setup-env.prompt.md) プロンプトを実行するようユーザーに案内する（これは実装前の準備ステップであり、実装後のレビューとは別）。すでにクリア済みであればそのまま進む。

---

## Step 5: 実装する

[copilot-instructions.md](../copilot-instructions.md) のガイドラインに従って実装すること。実装ルールはファイル配置・Tailwind・アイコン・画像・HTML要件の各セクションに分かれているので、該当セクションを参照しながら進める。

### ファイル配置のルール

| 種類 | 配置先 |
|------|--------|
| ページ | プロジェクトルートの `.html` ファイル |
| カラー・テーマ定義 | `src/style.css` の `@theme` ブロック |
| 画像 | `public/images/` |

新しいページを追加する場合はルートに `.html` ファイルを置くだけで自動的にビルド対象になる（設定変更不要）。

### 必ず守るルール

- スタイルは HTML の `class` 属性に Tailwind クラスを直接記述する
- CSS モジュールや外部 CSS は使わない
- `space-x-*` / `space-y-*` は使わず `gap-*` + flex/grid を使う
- レスポンシブ対応必須（`sm:`, `md:`, `lg:` ブレークポイントを活用）
- セマンティックなHTMLタグを使う（`header`, `main`, `footer`, `section`, `nav` 等）
- 画像には意味のある `alt` テキストを設定する

### Lucideアイコン

使用するアイコンは `src/main.ts` で登録してから HTML で参照する：

```ts
import { createIcons, ArrowRight, Menu } from 'lucide'
createIcons({ icons: { ArrowRight, Menu } })
```

```html
<i data-lucide="arrow-right"></i>
```

### 画像

**Unsplash などの無償素材を使う場合**：テイストやサイト種別に合った画像を選び、`public/images/` にダウンロードしてルート相対パスで参照する。

```bash
curl -L "https://images.unsplash.com/photo-xxxxx?w=1200" -o public/images/hero.webp
```

```html
<img src="/images/hero.webp" alt="..." />
```

画像の内容を表す kebab-case でファイル名を付ける（例: `hero-office.webp`, `team-meeting.webp`）。

**プレースホルダーで進める場合**：背景色 + テキストで代替し、後から差し替えやすいようコメントを入れる。

```html
<!-- TODO: 画像に差し替える -->
<div class="bg-gray-200 flex items-center justify-center w-full h-64">
  <span class="text-gray-400 text-sm">Hero Image</span>
</div>
```

### HTMLページの必須要件

すべての HTML ファイルに以下を含める：

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ページタイトル</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/all.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/display-all.css" />
  </head>
  <body>
    <!-- コンテンツ -->
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### ページ間のリンク

通常の `<a>` タグでリンクする：

```html
<a href="/about.html">About</a>
```

---

## Step 6: 実装後の確認

実装が終わったら：

1. `<pm> run dev` で開発サーバーを起動してブラウザで確認するようユーザーに案内する
2. `<pm> run build` を実行してTypeScriptエラーがないか確認する
3. ユーザーに完成を報告し、次のページまたは修正要望を聞く

実装後のビジュアルレビューをより丁寧に行いたい場合は [figma-review-figma](figma-review-figma.prompt.md) プロンプトも利用できることを案内する。
