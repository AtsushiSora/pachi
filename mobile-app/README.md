# スマホアプリ化準備

現時点ではWeb/PWAを本体として保ち、アプリ版はその後にラッパーとして追加する方針です。
AdSense審査中は、Web版の安定化とストア申請に必要な素材整理を優先します。

## 方針

- Web/PWA版を先に完成状態へ近づける
- Web版とアプリ版でゲームロジックを分けない
- AndroidはTrusted Web Activity、またはCapacitorを候補にする
- iOSはCapacitor / WKWebViewを候補にする
- AdMob SDKの本格実装はアプリの器を決めてから行う

Web版とアプリ版のフォルダは、今すぐ完全に分けません。
共通部分を維持し、アプリ用の設定と申請資料だけを `mobile-app/` に集約します。

## 先に済ませること

1. `MANUAL_TEST_CHECKLIST.md` の実機確認を通す
2. AdSense審査の結果を待つ
3. 広告ユニットIDを入れてWeb版の表示を確認する
4. PWAとしてiPhone SafariとAndroid Chromeで確認する
5. Google Play ConsoleとApple Developer Programの準備範囲を決める

## Android候補

第一候補はTrusted Web Activityです。
WebサイトをほぼそのままAndroidアプリとして包めるため、Web版の更新とアプリ版の差分が小さくなります。

必要になるもの:

- Google Play Console
- package name
- SHA-256証明書フィンガープリント
- `assetlinks.json`
- `app-ads.txt`
- プライバシーポリシーURL
- ストア用スクリーンショット
- 年齢レーティング

詳細は `mobile-app/android/README.md` を参照します。

## iOS候補

iOSはWebサイトをそのまま出すだけだとApp Store審査で弱くなる可能性があります。
まずPWAで公開し、必要になった段階でCapacitor / WKWebViewのアプリ化を検討します。

必要になるもの:

- Apple Developer Program
- Bundle ID
- プライバシーポリシーURL
- ストア用スクリーンショット
- 年齢レーティング
- AdMobアプリIDと広告ユニットID

詳細は `mobile-app/ios/README.md` を参照します。

## 広告

Web版はAdSense、アプリ版はAdMobを使います。
アプリ版を作る段階では、テスト広告で表示確認してから本番広告に切り替えます。

審査中の今は、プレースホルダー広告のままで問題ありません。

