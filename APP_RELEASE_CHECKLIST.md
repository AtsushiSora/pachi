# スマホアプリ化チェックリスト

ICHIGEKI 一撃スロパチをスマホアプリとして公開する時の確認リストです。

## まず決めること

- アプリ名: ICHIGEKI 一撃スロパチ
- 公開Webサイト: https://ichigekipachi.netlify.app/
- 連絡先: ichigekipachi@proton.me
- 対象: 18歳以上
- 用途: エンターテインメント目的のシミュレーション

## Web版で先に確認すること

1. `npm run release:check` が通る
2. Netlifyの本番URLでトップ、ランキング、チャレンジ、スペック、実戦が開く
3. `https://ichigekipachi.netlify.app/ads.txt` が表示できる
4. `https://ichigekipachi.netlify.app/app-ads.txt` が表示できる
5. `privacy.html`、`disclaimer.html`、`safety.html`、`about.html`、`contact.html` が公開されている
6. ランキング登録、結果シェア、オフライン表示を確認する
7. ランキングの差玉、使用玉、連チャン数が不自然でないことを確認する

## PWAとして確認すること

1. iPhoneのSafariで「ホーム画面に追加」ができる
2. AndroidのChromeで「アプリをインストール」または「ホーム画面に追加」ができる
3. ホーム画面から開いた時に、トップ、ランキング、シミュレーターが使える
4. オフライン時に `offline.html` が表示される
5. アイコンが正しく表示される

## Androidアプリ化で必要になるもの

- Google Play Consoleの開発者アカウント
- アプリID
- アプリの説明文、スクリーンショット、アイコン
- プライバシーポリシーURL
- AdMobアプリIDと広告ユニットID
- `app-ads.txt` の公開確認
- Webサイト連携を使う場合は `assetlinks.json`

## iOSアプリ化で必要になるもの

- Apple Developer Program
- Bundle ID
- アプリの説明文、スクリーンショット、アイコン
- プライバシーポリシーURL
- AdMobアプリIDと広告ユニットID
- 年齢レーティングの設定

## 広告IDが発行された後

1. `ads-config.js` の `slots.footer` と `slots.register` にAdSenseの広告ユニットIDを設定する
2. アプリ版ではAdMob SDK側の広告ユニットIDを設定する
3. テスト広告で表示確認する
4. 本番広告へ切り替える
5. 広告ユニットID設定後に `npm run release:check` を実行する

AdSense審査中は、Web版の広告枠がプレースホルダー表示でも問題ありません。審査通過後に `slots.footer` と `slots.register` へ広告ユニットIDを入れてから本番表示を確認します。

## 申請前の最終確認

- 実際のギャンブルを推奨しない説明がある
- 18歳以上対象の説明がある
- 問い合わせ先が見える
- プライバシーポリシーが見える
- 免責事項が見える
- ランキング不正対策のSupabase SQLが適用されている
- 秘密鍵や `service_role key` が公開ファイルに入っていない
- `SUPABASE_SECURITY.md` の手順を見返せる
- `security.txt` と問い合わせメールが公開されている
