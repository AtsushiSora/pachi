# ICHIGEKI 一撃スロパチ

パチンコのスペック試算、実戦風シミュレーター、全国ランキングチャレンジを楽しめるWebアプリです。

公開URL: https://ichigekipachi.netlify.app/

現在のバージョン: v2.0.0

## 主なページ

- `index.html`: トップ
- `sim.html`: スペックシミュレーター
- `app.html`: 実戦シミュレーター
- `ranking.html`: 全国ランキング
- `challenge.html`: ランキングチャレンジ
- `howto.html`: 使い方
- `safety.html`: 安心して使うために
- `contact.html`: お問い合わせ
- `about.html`: 運営者情報
- `privacy.html`: プライバシーポリシー
- `disclaimer.html`: 免責事項
- `404.html`: ページ未検出
- `offline.html`: オフライン表示

## 開発コマンド

```bash
nvm use
npm run dev
npm run check
npm run build
npm test
```

Node.jsは `.nvmrc` に合わせて22系を使います。

`npm run check` は公開前の簡易チェックです。主要ページ、メタ情報、PWA設定、sitemap、Service Workerのキャッシュ対象を確認します。

更新内容は `CHANGELOG.md` にまとめています。

## 自動チェックで守っていること

- トップ、ランキング、チャレンジ、スペック、実戦の主要導線
- ランキング登録、結果シェア、広告表示前の導線
- 差玉、使用玉、連チャン数などランキング値の整合性
- Supabaseのpublishable key設定と秘密鍵混入防止
- PWA、スマホ追加、Service Worker更新、オフライン表示
- AdSense / AdMob向けの広告枠、`ads.txt`、`app-ads.txt`
- セキュリティヘッダー、CSP、`security.txt`
- 法務ページ、問い合わせ先、18歳以上・エンタメ目的の案内

## リリース前チェック

1. `npm run release:check`
2. スマホでトップ、ランキング、チャレンジ、スペック、実戦を確認
3. ランキング登録と結果シェアを確認
4. Netlifyのデプロイ完了を確認

GitHub Actionsでも `main` へのpushとpull request時に `npm run release:check` を実行します。必要な時はActions画面から手動実行もできます。

## オンラインランキング

Supabaseを使っています。ランキング公開前またはセキュリティ調整時は、Supabase SQL Editorで `supabase-ranking.sql` を実行してください。

詳しい手順は `SUPABASE_SECURITY.md` を参照してください。

## 広告

AdSense / AdMob連携用の入口は入っています。

- `ads-config.js`: AdSenseのクライアントIDと広告ユニットIDを設定
- `ads.js`: 広告枠の描画
- `ads.txt`: AdSense向けの認証ファイル
- `app-ads.txt`: AdMob向けの認証ファイル

AdSense審査後、広告ユニットIDが発行されたら `ads-config.js` の `slots.footer` と `slots.register` に設定します。
スマホアプリ版をAdMobに登録する時は、デベロッパーWebサイトとして公開URLを設定し、`https://ichigekipachi.netlify.app/app-ads.txt` が見える状態にします。

審査中は広告枠のプレースホルダー表示で問題ありません。広告ユニットIDを入れた後は、必ず `npm run release:check` と実機表示を確認してください。

## PWA

`manifest.json` と `sw.js` でスマホのホーム画面追加に対応しています。
Service Workerのキャッシュ内容を変えた時は、`sw.js` の `CACHE_NAME` を更新してください。

スマホアプリ化の準備は `APP_RELEASE_CHECKLIST.md` にまとめています。

## セキュリティ連絡先

- `SECURITY.md`: リポジトリ向けの連絡先
- `.well-known/security.txt`: 公開サイト向けの標準連絡先
