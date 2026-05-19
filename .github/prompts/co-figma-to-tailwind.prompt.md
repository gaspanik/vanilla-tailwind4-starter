---
description: Figma ファイルの Variables をすべて取得し、Tailwind CSS v4 の @theme トークンとして src/style.css に書き込む
tools:
  - search/codebase
  - edit/editFiles
  - com.figma.mcp/mcp/use_figma
---

Figma URL を指定してください。指定されたファイルのすべての Variables を取得し、Tailwind CSS v4 の `@theme` カスタムプロパティとして `src/style.css` に書き込みます。

**返答言語:** 日本語で返答する。

---

## Step 1: URL を解析する

指定された Figma URL から `fileKey` を抽出する：

- `figma.com/design/:fileKey/...` → `:fileKey` を取得
- `?node-id=` クエリパラメータは無視してよい（変数はファイル全体に属する）

---

## Step 2: すべての変数を取得する

`use_figma` に以下の Plugin API コードを渡してファイル内のすべての変数を取得する（未使用のものも含む）：

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

---

## Step 3: 変数を CSS カスタムプロパティに変換する

変換は以下の 4 つのサブステップを順番に適用する。

### Step 3-1: モードの値を選ぶ

コレクションに複数のモード（ライト/ダークなど）がある場合、**`defaultModeId`** モードの値のみを使用する。それ以外のモードは無視する。

### Step 3-2: 変数名をケバブケースに変換する

1. コレクション名はコメント（`/* Collection Name */`）として出力し、プロパティ名には使わない
2. スラッシュ区切りのパスをハイフンで結合する
   - 例: `colors/brand/500` → `brand-500`、`font/size/xl` → `text-xl`
3. 名前内のハイフンが小数点を表す場合（`0-5`、`1-5`）はアンダースコアに変換する
   - 例: `spacing/0-5` → `--spacing-0_5`

### Step 3-3: タイプとコレクション名から CSS プレフィックスを決める

以下の表を上から順に評価し、最初に一致した行のプレフィックスを使用する：

| Figma タイプ | 変数名/コレクションのヒント | CSS プレフィックス | 変換例 |
|---|---|---|---|
| `COLOR` | （任意） | `--color-` | `colors/brand/500` → `--color-brand-500` |
| `FLOAT` | `size/*` を含む | `--spacing-` | `size/4` → `--spacing-4` |
| `FLOAT` | `radius/*` を含む | `--radius-` | `radius/md` → `--radius-md` |
| `FLOAT` | `border/*` を含む | `--border-` | `border/2` → `--border-2` |
| `FLOAT` | `font/size/*` を含む | `--text-` | `font/size/base` → `--text-base` |
| `FLOAT` | `font/weight/*` を含む | `--font-weight-` | `font/weight/bold` → `--font-weight-bold` |
| `STRING` | `font/family/*` を含む | `--font-` | `font/family/base` → `--font-base` |
| `STRING` | その他 | `--` | `easing/default` → `--easing-default` |

### Step 3-4: 値をフォーマットする

**COLOR（`{ r, g, b, a }` → 16進数）**

1. `r, g, b` を `Math.round(値 × 255)` で 0〜255 の整数に変換する
2. 各値を 2 桁の16進数にして `#rrggbb` にする
3. alpha < 1.0 の場合のみ `rgba(r, g, b, a)` 形式を使用する（r, g, b は 0〜255 の整数）

例: `{ r: 0.533, g: 0.414, b: 0.347, a: 1 }` → `Math.round(0.533×255)=136=0x88` → `#886a59`

**FLOAT（数値 → rem）**

| 入力値 | 出力 |
|---|---|
| `0` | `0` |
| 変数名が `px` 系かつ値が `1` | `1px` |
| それ以外 | `値 ÷ 16` + `rem`（例: `16` → `1rem`、`8` → `0.5rem`） |

---

## Step 4: src/style.css に書き込む

`src/style.css` を読み込み、`@theme` ブロックの有無を確認する。

**ケース A: `@theme` ブロックがすでに存在する**

既存の `@theme` ブロック内に変数を追記する。キーがすでに存在する場合は上書きする。

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

  /* Spacing */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-4: 1rem;

  /* Border Radius */
  --radius-none: 0;
  --radius-md: 0.375rem;
  --radius-full: 9999px;

  /* Font Size */
  --text-base: 0.9375rem;
  --text-xl: 1.25rem;

  /* Font Family */
  --font-base: "Noto Sans JP", sans-serif;

  /* Font Weight */
  --font-weight-bold: 700;
}
```

---

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
