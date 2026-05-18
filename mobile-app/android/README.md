# Androidアプリ化メモ

AndroidはTrusted Web Activityを第一候補にします。
理由は、既存のWeb/PWAを活かしながらGoogle Playに出しやすく、Web版とアプリ版の二重管理を避けられるためです。

## 必要情報

- アプリ名: ICHIGEKI 一撃スロパチ
- 公開URL: https://ichigekipachi.netlify.app/
- package name: 未定
- Google Play Console: 未設定
- AdMobアプリID: 未設定
- 広告ユニットID: 未設定

package name候補:

- `app.ichigekipachi.twa`
- `jp.ichigeki.pachi`

## Trusted Web Activityで必要なもの

1. Google Play Consoleの開発者アカウント
2. Androidアプリの署名鍵
3. SHA-256証明書フィンガープリント
4. `assetlinks.json`
5. Netlifyで `/.well-known/assetlinks.json` を公開
6. `app-ads.txt` の公開確認
7. ストア掲載文、スクリーンショット、アイコン
8. プライバシーポリシーURL
9. 年齢レーティング

## AdMob

Androidアプリとして登録した後にAdMobアプリIDと広告ユニットIDを発行します。
Web版のAdSense広告ユニットIDとは別管理にします。

本番前は必ずテスト広告で確認します。

## 後で決めること

- TWAで十分か
- Capacitorにしてネイティブ広告や通知を足すか
- ストア用スクリーンショットの端末サイズ
- 連携するGoogle Play Consoleアカウント

