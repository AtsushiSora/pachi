# 運用メモ

ICHIGEKI 一撃スロパチの公開後、手動で必要になる作業をまとめます。
コード変更だけでは完了しない作業をここで管理します。

## いま手動で必要なこと

### 1. Supabase SQLを再実行する

対象ファイル:

- `supabase-ranking.sql`

理由:

- ランキング登録時の差玉検査
- スコア上限検査
- ニックネーム制限
- URL、メールアドレス、電話番号のようなニックネーム制限

手順:

1. Supabaseを開く
2. 対象プロジェクトを開く
3. SQL Editorを開く
4. `supabase-ranking.sql` の中身を全部貼り付ける
5. `Run` を押す
6. `Success. No rows returned` が出ることを確認する
7. ランキング登録を1回テストする

### 2. AdSense審査結果を待つ

審査中は広告枠がプレースホルダー表示で問題ありません。

審査通過後にやること:

1. AdSenseで広告ユニットIDを作る
2. `ads-config.js` の `slots.footer` と `slots.register` に設定する
3. `npm run release:check` を実行する
4. 本番URLで広告表示を確認する
5. GitHubへpushする

### 3. 実機確認を実施する

対象ファイル:

- `MANUAL_TEST_CHECKLIST.md`

最低限確認する端末:

- iPhone Safari
- Android Chrome
- PC Chrome

重点確認:

- 全国チャレンジ開始
- 結果登録
- 結果シェア
- ランキング表示
- 広告枠の固定位置
- PWAホーム画面追加

## 毎回のリリース手順

1. 変更内容を確認する
2. `npm run release:check`
3. `git status --short`
4. `git add`
5. `git commit`
6. `git push origin main`
7. GitHub Actionsの `Release check` が成功することを確認する
8. Netlifyの本番反映を確認する

## 異常時の切り分け

### ランキング登録できない

確認順:

1. ブラウザConsole
2. Supabase SQL Editorのエラー
3. `supabase-ranking.sql` が最新か
4. ニックネームが制限に引っかかっていないか
5. 差玉が `総出玉 - 使用玉` と一致しているか

### 広告が出ない

確認順:

1. AdSense審査が通っているか
2. `ads-config.js` に広告ユニットIDが入っているか
3. `ads.txt` が公開URLで見えるか
4. ブラウザの広告ブロックが有効ではないか
5. Google側の配信開始待ちではないか

### PWAが更新されない

確認順:

1. `sw.js` の `CACHE_NAME` を更新したか
2. ブラウザで再読み込みしたか
3. ホーム画面追加済みアプリを一度閉じたか
4. `npm run release:check` が通っているか

## まだ後でよいこと

- Android TWA化
- iOSアプリ化
- AdMob SDK導入
- ストア用スクリーンショット撮影
- App Store / Google Playの申請入力

