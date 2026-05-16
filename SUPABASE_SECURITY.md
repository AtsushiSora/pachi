# Supabase セキュリティ手順

オンラインランキングを公開する前に、Supabase SQL Editorで `supabase-ranking.sql` を実行してください。

## やること

1. Supabaseを開く
2. 左メニューの `SQL Editor` を開く
3. `supabase-ranking.sql` の中身を全部コピーして貼り付ける
4. `Run` を押す
5. `Success. No rows returned` が出たらOK

## このSQLで守っていること

- ランキングは誰でも見られる
- ランキング登録は誰でもできる
- 登録済みデータの更新・削除はブラウザからできない
- ニックネームは空欄不可、10文字まで
- 差玉は `総出玉 - 使用玉` と一致しないと登録できない
- 極端に大きすぎるスコアや回転数は登録できない

## 注意

- Supabaseの `secret key` や `service_role key` は絶対にアプリに貼らない
- アプリに入れてよいのは `publishable key` だけ
- もし登録できなくなったら、まずSQL EditorのエラーとブラウザのConsoleを確認する
