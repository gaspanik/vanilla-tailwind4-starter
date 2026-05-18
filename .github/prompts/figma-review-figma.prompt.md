---
description: Figmaデザインと実装を比較してレビュー・修正する
tools:
  - execute/getTerminalOutput
  - execute/runInTerminal
  - edit/editFiles
  - search/codebase
  - com.figma.mcp/mcp/get_screenshot
  - com.figma.mcp/mcp/get_design_context
  - com.figma.mcp/mcp/get_variable_defs
---

レビューするFigma URLをチャットで指定してください（省略した場合は、直前の `figma-implement-figma` で実装したデザインを対象にします）。

Figma URLが無効またはアクセス不能な場合（`get_screenshot` または `get_design_context` がエラーを返した場合）は、処理を中断してユーザーに正しいURLの再入力を求めること。

> **注意**: ターミナルコマンドを実行する際は **Bash** を使用すること。

## 手順

### 1. Figmaのスクリーンショット取得

- `get_screenshot` で対象ノードのスクリーンショットを取得する
- `get_design_context` でデザインコンテキストを取得する
- `get_variable_defs` でデザイン変数を取得する
- スクリーンショットを参照しながら実装との視覚的差異を特定する

### 2. 視覚的差異の確認と修正

スクリーンショットと実装を比較して、以下の順に確認・修正する（優先度順）：

1. **レイアウト**（最優先）
2. **スタイル**
3. **レスポンシブ**

各確認項目の詳細：

**レイアウト**

- 要素の配置・整列（flex/grid の方向、justify/align の設定）
- スペーシング（padding, margin, gap の値）
- サイズ（幅・高さ）

**スタイル**

- 色（`@theme` トークンまたはTailwindのカラーパレット）
- タイポグラフィ（フォントサイズ、ウェイト、行間）
- 角丸（border-radius）、シャドウ（box-shadow）
- ボーダー（色・太さ・スタイル）

**レスポンシブ**

- モバイル（`sm:`）・タブレット（`md:`）・デスクトップ（`lg:`）での見た目

### 3. ビルドエラーの確認

下記の `<pm>` はお使いのパッケージマネージャ（`npm`・`yarn`・`pnpm` など）に読み替えてください。

```bash
<pm> run build
```

を実行してTypeScriptのエラーをすべて解消する。

よくある問題：

- 未使用のインポートや変数
- `any` 型の使用
- Lucideアイコンのインポート漏れ（HTMLで `data-lucide` を使っているのに `src/main.ts` に登録されていない）

### 4. アクセシビリティの確認

- キーボードナビゲーションが機能するか
- `aria-label` 等のARIA属性が適切に設定されているか
- 色コントラストがWCAG AA基準（4.5:1）を満たしているか
- 画像に意味のある `alt` テキストがあるか

### 5. レビュー結果の報告

以下をまとめて報告する：

- Figmaとの差異として特定した問題点
- 修正したファイルと変更内容
- 残っている課題（あれば）
