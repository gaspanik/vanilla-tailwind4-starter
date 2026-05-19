---
name: figma-to-tailwind-html
description: Reads all Variables from a Figma file URL and writes them as Tailwind CSS v4 @theme tokens into src/style.css.
argument-hint: <figma-url>
allowed-tools: mcp__plugin_figma_figma__use_figma, Read, Edit, Bash
---

# Figma Variables を Tailwind v4 トークンとしてインポート

`$ARGUMENTS` で指定された Figma ファイル URL からすべての変数を取得し、Tailwind CSS v4 の `@theme` カスタムプロパティとして `src/style.css` に書き込む。

**返答言語:** 日本語で返答する。

## Step 1: URL を解析する

`$ARGUMENTS` から fileKey を抽出する：

- `figma.com/design/:fileKey/...` → `:fileKey` を取得
- `?node-id=` クエリパラメータは無視してよい（変数はファイル全体に属する）

## Step 2: すべての変数を取得する

`use_figma` に Plugin API を渡してファイル内のすべての変数を取得する（未使用のものも含む）：

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();

const result = collections.map(col => ({
  id: col.id,
  name: col.name,
  modes: col.modes,
  defaultModeId: col.defaultModeId,
  variables: col.variableIds.map(varId => {
    const v = variables.find(x => x.id === varId);
    if (!v) return null;
    return {
      id: v.id,
      name: v.name,
      type: v.resolvedType,
      valuesByMode: v.valuesByMode
    };
  }).filter(Boolean)
}));

return result;
```

> **注意:** `get_variable_defs` はノードに適用済みの変数しか返さない。未使用の変数も含めてすべて取得するには必ず `use_figma` + Plugin API を使うこと。

## Step 3: 変数を CSS カスタムプロパティに変換する

Figma 変数を Tailwind v4 CSS カスタムプロパティに変換する。

### 名前変換ルール

Figma 変数名（スラッシュ区切り）をケバブケースに変換する：
- コレクション名はコメントとして使用する
- 最後のパスセグメントがプロパティ名になる（例: `colors/brand/500` → `brand-500`）
- スラッシュ区切りのグループはハイフンで結合する（例: `font/size/xl` → `text-xl`）
- 名前内でハイフンが小数点を表している場合（`0-5`、`1-5`）は CSS ではアンダースコアに変換する（`0_5`、`1_5`）

### タイプ別プロパティ名プレフィックス

| Figma タイプ | コレクション/変数名のヒント | CSS カスタムプロパティプレフィックス | 例 |
|---|---|---|---|
| `COLOR` | `colors/*` | `--color-` | `--color-brand-500` |
| `FLOAT` | `size/*` | `--spacing-` | `--spacing-4` |
| `FLOAT` | `radius/*` | `--radius-` | `--radius-md` |
| `FLOAT` | `border/*` | `--border-` | `--border-2` |
| `FLOAT` | `font/size/*` | `--text-` | `--text-base` |
| `FLOAT` | `font/weight/*` | `--font-weight-` | `--font-weight-bold` |
| `STRING` | `font/family/*` | `--font-` | `--font-base` |
| `STRING` | その他 | `--` | `--easing-default` |

### COLOR 値の変換

- Figma カラーは 0〜1 の範囲の `{ r, g, b, a }` で返される
- `r, g, b` を 0〜255 の整数に変換し、2桁の16進数でフォーマットする：`#rrggbb`
- alpha < 1.0 の場合は `rgba(r, g, b, a)` 形式を使用する（r, g, b は 0〜255 の整数）
- 例: `{ r: 0.533, g: 0.414, b: 0.347, a: 1 }` → `Math.round(0.533*255) = 136 = 0x88` → `#886a59`

### FLOAT 値の変換

- px を rem に変換する（÷ 16）
- 例外: 値 `0` → `0`；px タイプの変数名で値が `1` の場合 → `1px`

### モードの扱い

- コレクションに複数のモード（ライト/ダークなど）がある場合、**`defaultModeId`** モードの値を使用する

## Step 4: src/style.css に書き込む

### 既存ファイルの確認

`src/style.css` を読み込み、`@theme` ブロックがすでに存在するか確認する。

### 書き込みパターン

**ケース A: `@theme` ブロックがすでに存在する**

既存の `@theme` ブロック内に変数を追記する。キーがすでに存在する場合は上書き（更新）する。

**ケース B: `@theme` ブロックが存在しない**

`@import "tailwindcss";` の直後に新しい `@theme` ブロックを挿入する：

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-brand-500: #886a59;
}
```

### 出力フォーマット

コレクション/グループごとにコメントでセクションを分ける：

```css
@theme {
  /* Brand */
  --color-brand-50: #fff2ea;
  --color-brand-500: #886a59;

  /* Spacing (primitives/size) */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-4: 1rem;

  /* Border Radius (primitives/radius) */
  --radius-none: 0;
  --radius-md: 0.375rem;
  --radius-full: 9999px;

  /* Font Size (primitives/font/size) */
  --text-base: 0.9375rem;
  --text-xl: 1.25rem;

  /* Font Family (primitives/font/family) */
  --font-base: "Noto Sans JP", sans-serif;

  /* Font Weight (primitives/font/weight) */
  --font-weight-bold: 700;
}
```

## Step 5: 完了レポートを出力する

以下を報告する：
- インポートしたコレクション数と変数の合計数
- 追加/更新した CSS カスタムプロパティの一覧（グループ別の件数）
- 使用したモード名（複数モードがある場合）
- `src/style.css` のパス

## エラー処理

- URL から fileKey を抽出できない場合: 有効な Figma デザインファイル URL を指定するよう伝える
- 変数が 0 件の場合: ファイルに Variables が定義されていないことを報告する
- `src/style.css` が見つからない場合: ファイルが現在のディレクトリに存在しないことを報告し、出力パスを確認するよう伝える
- `use_figma` がエラーを返した場合: リトライ前にエラーメッセージを確認する（操作はアトミックなので部分書き込みは発生しない）
