# セキュリティ連絡先

ICHIGEKI 一撃スロパチで不具合やセキュリティ上の問題を見つけた場合は、下記までご連絡ください。

メール: ichigekipachi@proton.me

## 連絡時にあると助かる情報

- 発生したページ
- 発生日時
- 使用端末とブラウザ
- 再現手順
- スクリーンショット

## 注意

- Supabaseの `secret key` や `service_role key` は公開しない
- 公開アプリに入れるのは `publishable key` のみ
- ランキングの不正登録対策は `supabase-ranking.sql` とアプリ側バリデーションで管理する
