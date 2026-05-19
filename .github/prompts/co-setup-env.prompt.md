---
description: Figmaデザインの実装を始める前にスターターのデモコンテンツをクリアする
tools:
  - search/codebase
  - edit/editFiles
---

Figmaデザインの実装を開始する前に、スターターのデモコンテンツをクリアします。

> **注意**: ターミナルコマンドを実行する際は **Bash** を使用すること。

## 変更対象ファイル

以下のファイルを変更します。実行前に確認してください：

1. `index.html` — サンプルコンテンツをクリアして空のページにする
2. `src/main.ts` — Lucideアイコンの登録内容をクリアする。手順：①`createIcons` に渡している `icons` オブジェクトの中身をすべて削除する、②`createIcons` の呼び出し自体は削除せずに残す。

## 手順

### 確認

まず現在のファイル内容を読み取り、変更箇所とその内容を具体的にリスト形式で示し、ユーザーに確認を求めること。ユーザーが承認した場合のみ変更を実行すること。

### `index.html` の変更後イメージ

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/all.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/display-all.css" />
  </head>
  <body>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### `src/main.ts` の変更後イメージ

```ts
import './style.css'
import { createIcons } from 'lucide'

createIcons({ icons: {} })
```

### 変更後の確認

変更完了後、以下を報告する：

- 変更したファイルの一覧
- 次のステップとして「co-implement-figma」プロンプトで Figma URL を指定するよう案内する
