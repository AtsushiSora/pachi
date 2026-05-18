# iOSアプリ化メモ

iOSはPWA公開を先に安定させ、必要になった段階でCapacitor / WKWebViewのアプリ化を検討します。
App StoreはWebサイトを包んだだけのアプリに厳しい場合があるため、申請前にアプリとしての見え方を整える必要があります。

## 必要情報

- アプリ名: ICHIGEKI 一撃スロパチ
- 公開URL: https://ichigekipachi.netlify.app/
- Bundle ID: 未定
- Apple Developer Program: 未設定
- AdMobアプリID: 未設定
- 広告ユニットID: 未設定

Bundle ID候補:

- `app.ichigekipachi.ios`
- `jp.ichigeki.pachi`

## 申請前に必要なもの

1. Apple Developer Program
2. Bundle ID
3. Xcodeでのビルド環境
4. CapacitorまたはWKWebViewのアプリ本体
5. プライバシーポリシーURL
6. 年齢レーティング
7. ストア用スクリーンショット
8. サポートURL
9. AdMobアプリIDと広告ユニットID

## 注意点

- Web版とロジックを分けすぎない
- App Store審査向けに説明文、免責、18歳以上案内を明確にする
- 広告はテスト広告で確認してから本番IDに切り替える
- まずはPWAとしてiPhone Safariのホーム画面追加を確認する

