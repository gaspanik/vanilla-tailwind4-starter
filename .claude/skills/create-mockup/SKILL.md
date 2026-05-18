---
name: create-mockup
description: UIモックアップを作成するスキル。ユーザーが「モックアップを作りたい」「新しいページを作って」「UIデザインを実装したい」「サイトの画面を作りたい」「LP/トップページを作って」「デザインを実装して」などと言った場合は必ずこのスキルを使う。サイト種別・デザインテイスト・ページ種別の3つをヒアリングしてから、このプロジェクトのCLAUDE.md仕様に沿って実装する。Figma URLがない状態でUIを作る場合に特に有効。
---

# create-mockup — UIモックアップ作成スキル

ユーザーの要件をヒアリングして、プロジェクトの技術スタック（Vite + Vanilla TypeScript + Tailwind CSS v4）に沿ったUIモックアップを実装する。

---

## Step 1: サイト・アプリの種類を確認する

まず、何を作りたいか聞く。一問一答で進めると UX がいいので、最初の質問はこれだけでいい:

> 「どんなサイト・アプリの画面を作りたいですか？（例：ECサイト、コーポレートサイト、LP、ブログ、ポートフォリオなど）」

ユーザーの回答から用途・ターゲットユーザー・コンテンツの大まかなイメージを把握する。

---

## Step 2: デザインテイストを確認する

次にデザインの方向性を確認する。以下の観点でまとめて質問すると効率的:

> 「デザインのイメージを教えてください:
> - カラー: ブランドカラーや使いたい色はありますか？（なければ「おまかせ」でも可）
> - テイスト: モダン・ミニマル・ナチュラル・ビビッド・クラシックなど、雰囲気のイメージは？
> - 参考サイトや気になるデザインがあれば教えてください（なくてもOK）
> - 画像素材: Unsplash などの無償素材を使いますか？それともプレースホルダー（背景色のみ）で進めますか？」

ユーザーが「おまかせ」と言った場合は、Step 1 で聞いたサイト種別に合わせて適切なカラーとテイストを自分で決めて、決定内容をユーザーに一言伝えてから進む。画像についても未回答の場合はプレースホルダーで進める。

### カラーを決めたら @theme に定義する

ユーザーまたは自分で決めたカラーは `src/style.css` の `@theme` ブロックに追加する:

```css
@import "tailwindcss";

@theme {
  --color-primary: #2C4A7C;
  --color-secondary: #F4A261;
  --color-accent: #E76F51;
  --color-surface: #FAF7F2;
}
```

Tailwind CSS v4 なので `tailwind.config.js` は使わない。

**⚠️ 色名の命名規則 — Tailwind 組み込みユーティリティとの衝突を避ける**

`--color-<name>` の `<name>` に以下を使うと、既存の Tailwind ユーティリティ（フォントサイズ・ブレークポイント等）と名前が衝突してクラスの意味が曖昧になる。**必ず避けること:**

| 避けるべき名前 | 衝突するユーティリティ |
|---|---|
| `base` | `text-base`（font-size: 1rem）|
| `sm` / `md` / `lg` / `xl` | レスポンシブブレークポイント |
| `full` / `auto` / `none` | `w-full`, `m-auto` 等 |
| `inherit` / `current` / `transparent` | CSS キーワード |

代替案: `surface`, `canvas`, `paper`, `cream`, `dark`, `light` など意味が明確な名前を使う。

---

## Step 3: ページ種別と優先順位を確認する

どのページを作るか確認する:

> 「どのページを作りますか？複数ある場合は優先順位も教えてください。
> - トップページ（ヒーロー・特徴・CTA など複数セクション）
> - 商品一覧 / 詳細ページ
> - 記事一覧 / 詳細ページ
> - フォーム（お問い合わせ・サインアップ など）
> - その他（具体的に）」

ページが複数ある場合は1ページずつ実装し、完成したら次を聞くスタイルにする。

---

## Step 4: クリーンアップの確認

`index.html` のデモコンテンツが残っている場合は、実装前に以下のコマンドを実行するようユーザーに案内する：

```
/figma:setup-env
```

すでにクリア済みであればそのまま進む。

---

## Step 5: 実装する

### ファイル配置のルール

| 種類 | 配置先 |
|------|--------|
| ページ | プロジェクトルートの `.html` ファイル |
| カラー・テーマ定義 | `src/style.css` の `@theme` ブロック |
| 画像 | `public/images/` |

**新しいページを追加する場合はルートに `.html` ファイルを置くだけで自動的にビルド対象になる**（設定変更不要）。

### 必ず守るルール

- スタイルは HTML の `class` 属性に Tailwind クラスを直接記述する
- CSS モジュールや外部 CSS は使わない
- `space-x-*` / `space-y-*` は Tailwind v4 では非推奨 → `gap-*` with flex/grid を使う
- レスポンシブ対応必須（`sm:`, `md:`, `lg:` ブレークポイントを活用）
- セマンティックなHTMLタグを使う（`header`, `main`, `footer`, `section`, `nav` 等）
- 画像には意味のある `alt` テキストを設定する

### アクセシビリティ規則（必須）

**ナビゲーション構造**

ナビゲーションは必ず `nav > ul > li > a` の構造にする:

```html
<!-- ❌ 避ける -->
<nav>
  <a href="#about">About</a>
  <a href="#works">Works</a>
</nav>

<!-- ✅ 正しい -->
<nav aria-label="メインナビゲーション">
  <ul class="flex gap-6">
    <li><a href="#about" class="hover:text-primary">About</a></li>
    <li><a href="#works" class="hover:text-primary">Works</a></li>
  </ul>
</nav>
```

**大文字テキスト**

HTMLに直接大文字で書かず、`uppercase` クラスでスタイルとして適用する。テキスト自体は先頭大文字・残り小文字で記述する:

```html
<!-- ❌ 避ける（スクリーンリーダーが1文字ずつ読み上げる） -->
<a href="#concept">CONCEPT</a>
<button>CONTACT US</button>

<!-- ✅ 正しい -->
<a href="#concept" class="uppercase">Concept</a>
<button class="uppercase">Contact us</button>
```

ブランド名・固有名詞（例: `NIKE`, `NASA`）はそのまま大文字で書いて構わない。

**その他のアクセシビリティ**

- `<button>` にはテキストか `aria-label` を必ず付ける（アイコンのみのボタンには `aria-label` 必須）
- フォームの `<input>` には対応する `<label>` を紐付ける（`for` / `id` でリンクする）
- `<section>` / `<article>` には見出し（`h2` 以下）を含めるか `aria-label` を付ける
- `<img>` の `alt` は内容を説明するテキストにする（装飾画像は `alt=""`）

### アイコン

Lucide アイコンを使う場合は `src/main.ts` で登録してから HTML で参照する:

```typescript
// src/main.ts
import { createIcons, ArrowRight, Menu } from 'lucide'
createIcons({ icons: { ArrowRight, Menu } })
```

```html
<i data-lucide="arrow-right"></i>
```

### 画像

- **Unsplash などの無償素材を使う場合**: Step 2 で確認済みのテイストやサイト種別に合った画像を選び、`public/images/` にダウンロードしてルート相対パスで参照する
  ```bash
  # Unsplash の場合（?w= でリサイズ可能）
  curl -L "https://images.unsplash.com/photo-xxxxx?w=1200" -o public/images/hero.webp
  ```
  ```html
  <img src="/images/hero.webp" alt="..." />
  ```
  画像の内容を表す kebab-case でファイル名を付ける（例: `hero-office.webp`, `team-meeting.webp`）
- **プレースホルダーで進める場合**: 背景色 + テキストで代替し、後から差し替えやすいようコメントを入れる
  ```html
  <!-- TODO: 画像に差し替える -->
  <div class="bg-gray-200 flex items-center justify-center w-full h-64">
    <span class="text-gray-400 text-sm">Hero Image</span>
  </div>
  ```

### ページ間のリンク

マルチページなので通常の `<a>` タグでリンクする:

```html
<a href="/about.html">About</a>
```

### HTML ページの必須要件

すべての HTML ファイルに CLAUDE.md の要件を必ず含める:

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

---

## Step 6: 実装後の確認

実装が終わったら以下の順で確認する:

### 1. クラス重複・命名衝突チェック（必須）

HTML ファイルの各要素で同じクラスが複数回指定されていないか確認する:

```bash
# 同一要素内でのクラス重複を検出（例）
grep -n 'class="' index.html | grep -oP 'class="[^"]*"' | tr ' ' '\n' | sort | uniq -d
```

チェック観点:
- **クラスの重複**: 同じ `class` 属性内に同じクラス名が2回以上ある（例: `text-surface text-surface`）
- **サイズ vs カラーの衝突**: `@theme` で定義した色名と Tailwind 組み込みユーティリティ名が被っていないか（Step 2 の命名規則を参照）
- **意味の競合**: `text-sm` と `text-base` のようにフォントサイズ系クラスが同じ要素に複数ある

### 2. ビルドエラーチェック

```bash
<pm> run build
```

TypeScript エラーや Vite のビルドエラーがないことを確認する。

### 3. 動作確認

`<pm> run dev` でdev serverを起動してブラウザで確認するようユーザーに案内する。

### 4. 報告

ユーザーに完成を報告し、次のページ or 修正要望を聞く。

レビューをより丁寧に行いたい場合は `/figma:review-figma` コマンドも利用できることを案内する。

---

## よくある落とし穴

- Tailwind v4 は `@theme` でカスタムトークンを定義（`tailwind.config.js` は不要）
- **`--color-base` は使わない**: `text-base`（font-size）と衝突する。`--color-surface` など別名を使う
- **同一要素内のクラス重複**: `text-surface text-surface` のような重複は意図せず発生しやすい。実装後に必ず目視 or grep で確認する
- パスエイリアスは `@` で `src/` を指す（TypeScript のみ。HTML ファイルからは使えない）
- Lucide アイコンは `src/main.ts` で登録しないと HTML で表示されない
- 画像は `public/images/` に置いてルート相対パス（`/images/...`）で参照する
- **大文字テキスト**: HTML に直接 `ABOUT` と書かず `<span class="uppercase">About</span>` にする（スクリーンリーダー対策）
- **ナビゲーション**: `nav > ul > li > a` の構造を必ず使う。`nav` の直下に `<a>` を並べない
