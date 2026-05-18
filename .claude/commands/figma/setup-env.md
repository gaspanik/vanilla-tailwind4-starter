Figmaデザインの実装を開始する前に、スターターのデモコンテンツをクリアします。

## 変更対象ファイル

以下のファイルを変更します。実行前に確認してください：

1. `index.html` — `<body>` 内のデモコンテンツをクリアして空のページにする

## 手順

### 確認

まず現在の `index.html` の内容を読み取り、「以下の変更を行います」と具体的に示してユーザーに確認を求めること。ユーザーが承認した場合のみ変更を実行すること。

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

### 変更後の確認

変更完了後、以下を報告する：
- 変更したファイルの一覧
- 次のステップとして `/figma:implement-figma <Figma URL>` を実行するよう案内する
