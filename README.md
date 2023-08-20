# gas-receipt-ocr

## 目的

レシートを LINEアプリのカメラで撮影して、文字化されたテキストを Google スプレッドシートに追加します。

## 準備

### LINEアプリ

https://play.google.com/store/apps/details?id=jp.naver.line.android&hl=ja&gl=US

アカウントを作成します。

### LINE Developerコンソール

https://developers.line.biz/ja/

アカウントを作成します（作成方法は他のサイトを参照）。

`LINE_ACCESS_TOKEN` を取得します。
また、LINE アカウントを自分の LINE アプリに友達登録しておきます。

### Googleドライブ

https://drive.google.com/drive/

`FOLDER_ID`
新しいフォルダを作成、IDを取得します。
GoogleドライブのURL `https://drive.google.com/drive/u/0/folders/...`の`...`部分をコピーしておきます。

`SHEET_ID`、`SHEET_NAME`
スプレッドシートを作成、IDを取得します。
スプレッドシートのURL `https://docs.google.com/spreadsheets/d/.../edit#gid=0`の`...`部分をコピペしておきます。
また、下部のシート名が規定だと`シート1`になっているのでわかりやすい英語名に変更し、コピペしておきます。


### Google Apps Script

https://script.google.com/home

[コードをペーストします](receipt-ocr.gs)。

作成者ごとに異なる定数や API キーは、GAS が用意している PropertiesService に設定します。

「プロジェクトの設定」「スクリプトプロパティ」に、以下の6個の定数を設定します。

* `LINE_DATA_ENDPOINT`
    * `https://api-data.line.me/v2/bot/message/`
* `LINE_ENDPOINT`
    * `https://api.line.me/v2/bot/message/reply`
* `LINE_ACCESS_TOKEN`
* `FOLDER_ID`
* `SHEET_ID`
* `SHEET_NAME`

## 使い方

1. LINE アプリを起動し、あらかじめ友達登録したアカウントを開きます
1. 左下のカメラボタンをクリックでレシートを撮影します
1. Googleスプレッドシートにテキストが追加されます
1. 家計簿にペーストします

## 留意事項

* 文字・数字・記号・文字のかすれ・傷を誤認識することがあります
* レシートをそのまま再現できるわけではありません

## 参考文献

* [【無料で作れる】GASで簡単！レシートOCRで家計簿入力【画像を文字に】](https://prtn-life.com/blog/gas-line-ocr)（prtn-blog）
* [【GAS】PropertiesServiceでスクリプトプロパティ取得・保存方法(ユーザープロパティも)](https://auto-worker.com/blog/?p=7805)（AutoWorker〜Google Apps Script(GAS)とSikuliで始める業務改善入門）

## ライセンス

MIT
