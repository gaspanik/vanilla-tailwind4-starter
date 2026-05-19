---
description: src/style.css の Tailwind CSS v4 @theme トークンを読み込み、Figma Variables として書き込む。Figma URL を指定すると既存ファイルに追記、Figma URL が指定されない場合（空文字・引数なし含む）は新規ファイルを作成する
tools:
  - search/codebase
  - edit/editFiles
  - com.figma.mcp/mcp/use_figma
  - com.figma.mcp/mcp/create_new_file
  - com.figma.mcp/mcp/whoami
---

`src/style.css` の `@theme` ブロックにあるすべての CSS カスタムプロパティを読み込み、Figma Variables として書き込みます。

- **Figma URL を指定** → 既存ファイルに追記
- **ファイル名を指定** → その名前で新規ファイルを作成
- **引数なし** → "Design Tokens" という名前で新規ファイルを作成

**返答言語:** 日本語で返答する。

---

## Step 1: src/style.css を読み込んで解析する

`src/style.css` を読み込み、`@theme { ... }` ブロック内のすべての CSS カスタムプロパティを抽出する。

### Step 1-1: コレクションと変数タイプを決める

以下の表を**上から順に**評価し、最初に一致した行を使用する：

| CSS 変数プレフィックス | Figma コレクション | Figma 変数タイプ |
|---|---|---|
| `--color-*` / `--*-color-*` | `Colors` | `COLOR` |
| `--*-font-family` / `--font-family-*` / `--default-font-family` / `--heading-font-family` | `Typography` | `STRING` |
| `--font-*`（値が文字列） | `Typography` | `STRING` |
| `--text-*`（値が数値/rem/px） / `--font-size-*` | `Typography` | `FLOAT` |
| `--font-weight-*` | `Typography` | `FLOAT` |
| `--spacing-*` | `Spacing` | `FLOAT` |
| `--radius-*` | `Radius` | `FLOAT` |
| `--border-*`（値が数値） | `Border` | `FLOAT` |
| その他の `--*` | `Other` | 値から判定 |

### Step 1-2: 変数名を Figma スラッシュ記法に変換する

プレフィックス部分を取り除いた残りを変数名として使用する：

| CSS 変数 | Figma 変数名 |
|---|---|
| `--color-primary` | `primary` |
| `--color-brand-500` | `brand/500` |
| `--default-font-family` | `default` |
| `--heading-font-family` | `heading` |
| `--font-sans` | `sans` |
| `--text-base` | `size/base` |
| `--spacing-4` | `4` |
| `--radius-md` | `md` |

---

## Step 2: CSS 値を Figma 値に変換する

### COLOR 変換

- `#rrggbb` → `{ r: parseInt(rr,16)/255, g: parseInt(gg,16)/255, b: parseInt(bb,16)/255, a: 1 }`
- `#rrggbbaa` → alpha も含めて変換
- `rgba(r, g, b, a)` → `{ r: r/255, g: g/255, b: b/255, a: a }`
- `rgb(r, g, b)` → `{ r: r/255, g: g/255, b: b/255, a: 1 }`

### STRING 変換（フォントファミリー）

- `"Font Name", fallback` → `"Font Name"`（最初のクォート付きフォント名のみ抽出）
- クォートと最初のカンマ以降（フォールバックフォント）を削除する

### FLOAT 変換（数値）

- `1rem` → `16`（px 換算 × 16）
- `0.5rem` → `8`
- `16px` → `16`（px を除去）
- `0` → `0`
- `1px` → `1`

---

## Step 3: Figma ファイルを準備する

以下の表に従って、入力に応じた処理を行う：

| 入力の条件 | 処理 |
|---|---|
| `figma.com` を含む URL が指定された | URL から `fileKey` を抽出して使用する（`?node-id=` は無視）。`whoami` / `create_new_file` の呼び出しは不要 |
| URL 形式だが `figma.com` を含まない | ユーザーに無効な URL であることを通知し、処理を終了する |
| ファイル名のみが指定された（URL ではない文字列） | `whoami` でプラン一覧を取得し、`create_new_file` でその名前のファイルを新規作成する |
| 引数なし、または空文字 | `whoami` でプラン一覧を取得し、`create_new_file` で "Design Tokens" という名前のファイルを新規作成する |

**`whoami` の結果に応じた `planKey` の決め方：**

- **プランが 1 つ** → その `key` を `planKey` として使用
- **複数のプラン** → どのチーム/組織にファイルを作成するか確認してから進める

`create_new_file` で新規ファイルを作成する：

```
create_new_file({
  fileName: "<引数で指定された名前、または "Design Tokens">",
  planKey: "<whoami で取得した planKey>",
  editorType: "design"
})
```

返却された `fileKey` を以降の `use_figma` 呼び出しで使用する。

---

## Step 4: Figma Variables を作成する

`use_figma` に Plugin API を渡して、コレクションと変数を一括作成する。

**変数が存在しないコレクションはスキップする**（トークンが 1 つ以上あるカテゴリのみコレクションを作成する）。

以下のコードを `use_figma` に渡す（`tokenData` は前のステップで抽出した実際の値で埋める）：

```javascript
// ===== 実際のトークンデータ（Step 1〜2 の値で埋める） =====
const tokenData = {
  Colors: [
    // 例: { name: "primary", type: "COLOR", value: { r: 0.173, g: 0.094, b: 0.063, a: 1 } }
  ],
  Typography: [
    // 例: { name: "default", type: "STRING", value: "Gen Interface JP" }
    // 例: { name: "size/base", type: "FLOAT", value: 16 }
  ],
  Spacing: [
    // 例: { name: "4", type: "FLOAT", value: 16 }
  ],
  Radius: [],
  Border: [],
  Other: [],
};
// ==========================================================

const results = [];

for (const [collectionName, variables] of Object.entries(tokenData)) {
  if (variables.length === 0) continue;

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection = collections.find(c => c.name === collectionName);
  if (!collection) {
    collection = figma.variables.createVariableCollection(collectionName);
  }
  const modeId = collection.defaultModeId;

  for (const token of variables) {
    const existingVars = await figma.variables.getLocalVariablesAsync();
    let variable = existingVars.find(
      v => v.variableCollectionId === collection.id && v.name === token.name
    );

    if (!variable) {
      variable = figma.variables.createVariable(token.name, collection, token.type);
    }

    variable.setValueForMode(modeId, token.value);
    results.push(`${collectionName}/${token.name} (${token.type})`);
  }
}

return { created: results.length, variables: results };
```

> **注意:** 実行前に `tokenData` を必ず前のステップで抽出した**実際の値**で埋めること。変数が多い場合（30件以上）はコレクション別に分割して呼び出す。

---

## Step 5: 完了レポートを出力する

以下を報告する：

- Figma ファイル名と fileKey（または URL）
- 作成したコレクションの一覧とコレクション別の変数件数
- 作成した変数の一覧（コレクション別）
- スキップしたコレクション（空だったもの）
- 変換できなかった変数とその理由

## エラー処理

- `src/style.css` が見つからない場合: ファイルパスを確認するよう伝える
- `@theme` ブロックが空の場合: 変数が定義されていないことを報告する
- `create_new_file` が失敗した場合: Figma のログイン状態を確認するよう伝える（`whoami` で確認可能）
- 変換できない値（`var(--other)` 参照、`linear-gradient` など）はスキップして警告を出し、レポートに含める
