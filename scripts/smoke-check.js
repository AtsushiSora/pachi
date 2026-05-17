const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://ichigekipachi.netlify.app";

const publicPages = [
  "index.html",
  "sim.html",
  "app.html",
  "ranking.html",
  "challenge.html",
  "howto.html",
  "safety.html",
  "contact.html",
  "about.html",
  "privacy.html",
  "disclaimer.html",
  "offline.html",
  "404.html",
];

const sharePages = [
  "index.html",
  "sim.html",
  "app.html",
  "ranking.html",
  "challenge.html",
  "howto.html",
  "safety.html",
  "contact.html",
  "about.html",
  "privacy.html",
  "disclaimer.html",
];

const noindexPages = [
  "offline.html",
  "404.html",
];

const adPages = publicPages.filter(page => page !== "offline.html");
const legalLinks = [
  "about.html",
  "privacy.html",
  "disclaimer.html",
  "safety.html",
  "contact.html",
];

const requiredFiles = [
  "manifest.json",
  "sw.js",
  "robots.txt",
  "sitemap.xml",
  "ads.txt",
  "app-ads.txt",
  ".well-known/security.txt",
  "APP_RELEASE_CHECKLIST.md",
  "icon.svg",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "screenshot-home.png",
  "screenshot-ranking.png",
];

const scriptFiles = [
  "presets.js",
  "main.js",
  "ads-config.js",
  "ads.js",
  "pwa.js",
  "sw.js",
];

const errors = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function readPngSize(file) {
  const buffer = fs.readFileSync(path.join(root, file));
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function expect(condition, message) {
  if (!condition) errors.push(message);
}

function has(html, pattern) {
  return pattern.test(html);
}

function appearsInOrder(text, labels) {
  let cursor = -1;
  for (const label of labels) {
    const index = text.indexOf(label, cursor + 1);
    if (index === -1) return false;
    cursor = index;
  }
  return true;
}

function isLocalReference(value) {
  return value &&
    !value.startsWith("#") &&
    !value.startsWith("//") &&
    !/^(https?:|mailto:|tel:|data:|javascript:)/i.test(value);
}

function normalizeLocalReference(value) {
  const cleanValue = value.split("#")[0].split("?")[0];
  if (!cleanValue || cleanValue === "/") return null;

  const relativeValue = cleanValue.startsWith("/") ? cleanValue.slice(1) : cleanValue;
  const normalized = path.normalize(relativeValue);
  if (!normalized || normalized === ".") return null;

  return normalized;
}

const anchorCache = new Map();

function anchorsFor(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  if (!exists(file)) return new Set();

  const html = read(file);
  const anchors = new Set(
    [...html.matchAll(/\b(?:id|name)=["']([^"']+)["']/gi)].map(match => match[1])
  );
  anchorCache.set(file, anchors);
  return anchors;
}

function getAnchorReference(currentPage, value) {
  if (!value || !value.includes("#")) return null;
  if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(value)) return null;

  const [rawPath, rawHash] = value.split("#");
  const hash = (rawHash || "").split("?")[0];
  if (!hash) return null;

  const file = rawPath ? normalizeLocalReference(value) : currentPage;
  if (!file) return null;
  return { file, hash: decodeURIComponent(hash) };
}

function extractQuotedPaths(text) {
  return [...text.matchAll(/"([^"]+)"/g)].map(match => match[1]);
}

function extractSitemapEntries(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => {
    const block = match[1];
    const valueFor = tag => {
      const tagMatch = block.match(new RegExp(`<${tag}>([^<]+)<\\/${tag}>`));
      return tagMatch ? tagMatch[1].trim() : "";
    };
    return {
      loc: valueFor("loc"),
      lastmod: valueFor("lastmod"),
      changefreq: valueFor("changefreq"),
      priority: valueFor("priority"),
    };
  });
}

function expectedPageUrl(page) {
  return page === "index.html" ? `${siteUrl}/` : `${siteUrl}/${page}`;
}

function getAttribute(html, selectorPattern, attr) {
  const match = html.match(selectorPattern);
  if (!match) return "";
  const attrMatch = match[0].match(new RegExp(`${attr}=["']([^"']+)["']`, "i"));
  return attrMatch ? attrMatch[1] : "";
}

function getTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : "";
}

function checkJavaScriptSyntax(label, code) {
  try {
    new Function(code);
  } catch (error) {
    errors.push(`${label}: JavaScript構文エラー: ${error.message}`);
  }
}

function checkInlineScripts(page, html) {
  let index = 0;
  const scripts = html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi);
  for (const script of scripts) {
    const attrs = script[1] || "";
    const code = script[2] || "";
    if (/\bsrc\s*=/.test(attrs)) continue;
    if (/\btype\s*=\s*["']application\/ld\+json["']/i.test(attrs)) continue;
    if (!code.trim()) continue;
    index++;
    checkJavaScriptSyntax(`${page}: inline script ${index}`, code);
  }
}

function checkStructuredData(page, html) {
  let index = 0;
  const scripts = html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi);
  for (const script of scripts) {
    const attrs = script[1] || "";
    const code = script[2] || "";
    if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(attrs)) continue;
    index++;
    try {
      JSON.parse(code);
    } catch (error) {
      errors.push(`${page}: JSON-LD ${index} の構文エラー: ${error.message}`);
    }
  }
}

function checkBlankTargetLinks(page, html) {
  const links = html.matchAll(/<a\b[^>]*>/gi);
  for (const link of links) {
    const tag = link[0];
    if (!/\btarget\s*=\s*["']_blank["']/i.test(tag)) continue;
    const rel = getAttribute(tag, /<a\b[^>]*>/i, "rel");
    expect(/\bnoopener\b/i.test(rel), `${page}: target="_blank" のリンクに rel="noopener" がありません`);
  }
}

function checkDuplicateIds(page, html) {
  const seen = new Set();
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
    const id = match[1];
    expect(!seen.has(id), `${page}: id="${id}" が重複しています`);
    seen.add(id);
  }
}

for (const file of requiredFiles) {
  expect(exists(file), `${file} が見つかりません`);
}

for (const file of scriptFiles) {
  expect(exists(file), `${file} が見つかりません`);
  if (exists(file)) checkJavaScriptSyntax(file, read(file));
}

const localPreviewTokenAllowlist = new Map([
  ["app.html", ["file:", "localhost", "127.0.0.1"]],
  ["pwa.js", ["localhost", "127.0.0.1"]],
]);

for (const file of [...publicPages, ...scriptFiles, "manifest.json", "netlify.toml"]) {
  if (!exists(file)) continue;

  const content = read(file);
  const allowlist = localPreviewTokenAllowlist.get(file) || [];
  for (const token of ["/Users/", "Desktop/", "Downloads/", "file://", "localhost", "127.0.0.1"]) {
    if (allowlist.includes(token)) continue;
    expect(!content.includes(token), `${file}: 公開ファイルにローカル開発用の ${token} が含まれています`);
  }
}

for (const page of publicPages) {
  expect(exists(page), `${page} が見つかりません`);
  if (!exists(page)) continue;

  const html = read(page);
  expect(has(html, /<html lang="ja">/), `${page}: lang="ja" がありません`);
  expect(has(html, /<meta name="viewport"/), `${page}: viewport がありません`);
  expect(has(html, /<meta name="theme-color"/), `${page}: theme-color がありません`);
  expect(has(html, /<meta name="apple-mobile-web-app-capable" content="yes"/), `${page}: apple-mobile-web-app-capable がありません`);
  expect(has(html, /<meta name="mobile-web-app-capable" content="yes"/), `${page}: mobile-web-app-capable がありません`);
  expect(has(html, /<meta name="apple-mobile-web-app-status-bar-style"/), `${page}: apple-mobile-web-app-status-bar-style がありません`);
  expect(has(html, /<meta name="apple-mobile-web-app-title" content="一撃スロパチ"/), `${page}: apple-mobile-web-app-title が想定と違います`);
  expect(has(html, /<meta name="application-name" content="一撃スロパチ"/), `${page}: application-name が想定と違います`);
  expect(has(html, /<meta name="format-detection" content="telephone=no"/), `${page}: format-detection がありません`);
  expect(has(html, /<meta name="description"/), `${page}: description がありません`);
  expect(has(html, /<title>.+<\/title>/), `${page}: title がありません`);
  expect(getTitle(html).includes("ICHIGEKI"), `${page}: title に ICHIGEKI がありません`);
  expect(!html.includes("シュミ"), `${page}: 「シュミ」表記があります。「シミュ」に統一してください`);
  expect(has(html, /<link rel="manifest"/), `${page}: manifest link がありません`);
  expect(has(html, /<link rel="icon"/), `${page}: icon link がありません`);
  expect(has(html, /<link rel="apple-touch-icon"/), `${page}: apple-touch-icon link がありません`);
  checkInlineScripts(page, html);
  checkStructuredData(page, html);
  checkBlankTargetLinks(page, html);
  checkDuplicateIds(page, html);

  const localRefs = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)]
    .map(match => match[1])
    .filter(isLocalReference)
    .map(normalizeLocalReference)
    .filter(Boolean);

  for (const ref of localRefs) {
    expect(exists(ref), `${page}: ${ref} が見つかりません`);
  }

  const anchorRefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)]
    .map(match => match[1])
    .map(value => getAnchorReference(page, value))
    .filter(Boolean);

  for (const ref of anchorRefs) {
    expect(exists(ref.file), `${page}: ${ref.file} が見つかりません`);
    if (exists(ref.file)) {
      expect(anchorsFor(ref.file).has(ref.hash), `${page}: ${ref.file}#${ref.hash} のリンク先アンカーがありません`);
    }
  }
}

for (const page of sharePages) {
  const html = read(page);
  expect(has(html, /property="og:title"/), `${page}: og:title がありません`);
  expect(has(html, /property="og:description"/), `${page}: og:description がありません`);
  expect(has(html, /property="og:image"/), `${page}: og:image がありません`);
  expect(has(html, /property="og:site_name" content="ICHIGEKI 一撃スロパチ"/), `${page}: og:site_name が想定と違います`);
  expect(
    getAttribute(html, /<meta[^>]+property=["']og:url["'][^>]*>/i, "content") === expectedPageUrl(page),
    `${page}: og:url が公開URLと一致しません`
  );
  expect(has(html, /name="twitter:card"/), `${page}: twitter:card がありません`);
  expect(has(html, /<link rel="canonical"/), `${page}: canonical がありません`);
  expect(
    getAttribute(html, /<link[^>]+rel=["']canonical["'][^>]*>/i, "href") === expectedPageUrl(page),
    `${page}: canonical が公開URLと一致しません`
  );
}

for (const page of noindexPages) {
  const html = read(page);
  expect(has(html, /<meta name="robots" content="noindex"/), `${page}: noindex がありません`);
}

const manifest = JSON.parse(read("manifest.json"));
const pkg = JSON.parse(read("package.json"));
const indexHtml = read("index.html");
const simHtml = read("sim.html");
const howtoHtml = read("howto.html");
const appHtml = read("app.html");
const rankingHtml = read("ranking.html");
const challengeHtml = read("challenge.html");
const mainJs = read("main.js");
const pwaJs = read("pwa.js");
const styleCss = read("style.css");
const aboutHtml = read("about.html");
const contactHtml = read("contact.html");
const offlineHtml = read("offline.html");
const notFoundHtml = read("404.html");
const supabaseSql = read("supabase-ranking.sql");
const supabaseSecurity = read("SUPABASE_SECURITY.md");
const releaseWorkflow = read(".github/workflows/release-check.yml");
expect(manifest.name === "ICHIGEKI 一撃スロパチ", "manifest: name が想定と違います");
expect(manifest.short_name === "一撃スロパチ", "manifest: short_name が想定と違います");
expect(manifest.display === "standalone", "manifest: display が standalone ではありません");
expect(Array.isArray(manifest.icons) && manifest.icons.length >= 3, "manifest: icons が不足しています");
expect(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, "manifest: shortcuts が不足しています");
expect(Array.isArray(manifest.screenshots) && manifest.screenshots.length >= 2, "manifest: screenshots が不足しています");
expect(manifest.lang === "ja", "manifest: lang が ja ではありません");
expect(Array.isArray(manifest.display_override) && manifest.display_override.includes("standalone"), "manifest: display_override に standalone がありません");
expect(
  manifest.shortcuts.slice(0, 3).map(shortcut => shortcut.url).join(",") === "/ranking.html,/app.html,/sim.html",
  "manifest: shortcuts の順番が想定と違います"
);
expect(
  manifest.shortcuts.slice(0, 3).map(shortcut => shortcut.name).join(",") === "全国チャレンジ,実戦シミュレーター,スペックシミュレーター",
  "manifest: shortcuts の名前順が想定と違います"
);
expect(manifest.orientation === "portrait", "manifest: orientation が portrait ではありません");
expect(manifest.scope === "/", "manifest: scope が / ではありません");
expect(manifest.start_url === "/", "manifest: start_url が / ではありません");
expect(manifest.icons.some(icon => icon.src === "/icon-512.png" && icon.purpose.includes("maskable")), "manifest: maskable icon がありません");
expect(readPngSize("icon-192.png")?.width === 192 && readPngSize("icon-192.png")?.height === 192, "icon-192.png: サイズが192x192ではありません");
expect(readPngSize("icon-512.png")?.width === 512 && readPngSize("icon-512.png")?.height === 512, "icon-512.png: サイズが512x512ではありません");
expect(readPngSize("apple-touch-icon.png")?.width === 180 && readPngSize("apple-touch-icon.png")?.height === 180, "apple-touch-icon.png: サイズが180x180ではありません");
expect(readPngSize("screenshot-home.png")?.width === 390 && readPngSize("screenshot-home.png")?.height === 844, "screenshot-home.png: サイズが390x844ではありません");
expect(readPngSize("screenshot-ranking.png")?.width === 390 && readPngSize("screenshot-ranking.png")?.height === 844, "screenshot-ranking.png: サイズが390x844ではありません");
expect(pkg.version === "2.0.0", "package.json: version が 2.0.0 ではありません");
expect(pkg.private === true, "package.json: private が true ではありません");
expect(pkg.engines && pkg.engines.node === ">=22", "package.json: engines.node が >=22 ではありません");
expect(read(".nvmrc").trim() === "22", ".nvmrc: Nodeバージョンが22ではありません");
for (const word of ["workflow_dispatch", "push:", "pull_request:", "node-version-file: .nvmrc", "npm ci", "npm run release:check", "timeout-minutes: 10"]) {
  expect(releaseWorkflow.includes(word), `.github/workflows/release-check.yml: ${word} の記載がありません`);
}
expect(indexHtml.includes("v2.0"), "index.html: 表示バージョン v2.0 がありません");
for (const page of legalLinks) {
  expect(indexHtml.includes(`href="${page}"`), `index.html: ${page} への導線がありません`);
}
expect(
  appearsInOrder(indexHtml, ["全国チャレンジ", "実戦シミュレーター", "スペックシミュレーター", "使い方", "エンターテインメント専用", "スマホに追加"]),
  "index.html: TOP導線の順番が想定と違います"
);
expect(
  appearsInOrder(indexHtml, ['href="ranking.html"', 'href="app.html"', 'href="sim.html"', 'href="howto.html"', 'id="installCard"']),
  "index.html: TOPリンクとスマホ追加カードの順番が想定と違います"
);
expect(indexHtml.includes("beforeinstallprompt") && indexHtml.includes("deferredInstallPrompt.prompt()"), "index.html: ホーム画面追加プロンプト処理がありません");
expect(indexHtml.includes("appinstalled") && indexHtml.includes("card.hidden = true"), "index.html: インストール後にスマホ追加カードを隠す処理がありません");
expect(indexHtml.includes('window.location.href = "howto.html#install"'), "index.html: スマホ追加手順への導線がありません");
expect(
  appearsInOrder(howtoHtml, ["全国チャレンジ", "実戦シミュレーター", "スペックシミュレーター"]),
  "howto.html: モード説明の順番が想定と違います"
);
expect(howtoHtml.includes('id="install"') && howtoHtml.includes("Safari") && howtoHtml.includes("Chrome"), "howto.html: スマホ追加手順が不足しています");
expect(pwaJs.includes("serviceWorker") && pwaJs.includes('navigator.serviceWorker.register("/sw.js")'), "pwa.js: Service Worker登録がありません");
expect(pwaJs.includes("controllerchange") && pwaJs.includes("window.location.reload()"), "pwa.js: Service Worker更新時の再読込処理がありません");
expect(pwaJs.includes("SKIP_WAITING") && pwaJs.includes("registration.update()"), "pwa.js: Service Worker更新反映処理がありません");
expect(appHtml.includes("let fastMode  = false;"), "app.html: 高速モードの初期値がOFFではありません");
expect(appHtml.includes('id="speedLabel">OFF</span>'), "app.html: 高速ボタンの初期表示がOFFではありません");
expect(appHtml.includes("const normalSpeed = fastMode ? 1 : 80;"), "app.html: 高速OFF時の通常回転速度が想定と違います");
expect(appHtml.includes("addLog('実戦開始', 'log-normal');"), "app.html: 開始ログがありません");
expect(appHtml.includes("function setStartButtonActive(active)"), "app.html: START/STOP表示の共通処理がありません");
expect(appHtml.includes("setStartButtonActive(true);"), "app.html: 開始時にSTOP表示へ切り替えていません");
expect(appHtml.match(/setStartButtonActive\(false\);/g)?.length >= 3, "app.html: 停止時のSTART表示復帰が不足しています");
expect(appHtml.includes("let running   = false;") && appHtml.includes("let starting  = false;"), "app.html: 実戦開始の連打防止状態がありません");
expect(appHtml.includes("if (running || starting) return;"), "app.html: 実戦開始の二重起動防止がありません");
expect(appHtml.includes("useHp();") && appHtml.includes("function useHp()"), "app.html: 実戦開始時の体力消費がありません");
expect(appHtml.includes("const HP_MAX        = 5;") && appHtml.includes("const HP_RECOVER_MS = 30 * 60 * 1000;"), "app.html: 体力上限/自然回復間隔が想定と違います");
expect(appHtml.includes("recoverHp(HP_MAX)") && appHtml.includes("体力が全回復しました"), "app.html: 広告視聴時の体力全回復がありません");
expect(appHtml.includes("hp >= HP_MAX") && appHtml.includes("体力はすでに満タンです"), "app.html: 体力満タン時の広告視聴ガードがありません");
expect(appHtml.includes("localStorage.setItem('hp_count'") && appHtml.includes("localStorage.removeItem('hp_last_used')"), "app.html: 体力保存/全回復時刻リセットが不足しています");
expect(simHtml.includes('id="startBtn"') && simHtml.includes(">スタート</button>"), "sim.html: 試算開始ボタンの表示がスタートではありません");
expect(
  appearsInOrder(simHtml, ['id="startBtn"', 'class="setting-back-btn"', 'id="startMessage"']),
  "sim.html: スタート下の戻る導線/メッセージ順が想定と違います"
);
expect(simHtml.includes('href="index.html" class="setting-back-btn"'), "sim.html: トップへ戻る導線がありません");
expect(simHtml.includes('id="backBtn"') && simHtml.includes("← 設定に戻る"), "sim.html: プレイ画面の設定に戻るボタンがありません");
expect(mainJs.includes('startBtn.addEventListener("click", simulate)'), "main.js: スペックシミュレーターのスタート処理が接続されていません");
expect(mainJs.includes('backBtn.addEventListener("click"'), "main.js: スペックシミュレーターの戻る処理が接続されていません");
for (const id of ["hitRate", "breakRate", "continueRate", "spinPer250"]) {
  expect(simHtml.includes(`data-target="${id}"`), `sim.html: ${id} のスライダーがありません`);
}
for (const id of ["breakPayout", "failPayout", "payout1", "payout2", "payout3", "payout4", "ltPayout1", "ltPayout2"]) {
  expect(simHtml.includes(`id="${id}"`), `sim.html: ${id} の入力欄がありません`);
  expect(simHtml.includes(`data-target="${id}" min="0" max="10000" step="100"`), `sim.html: ${id} の出玉スライダーが100玉刻みではありません`);
  expect(mainJs.includes(id), `main.js: ${id} が計算対象に含まれていません`);
}
expect(mainJs.includes("function snapPayoutInput(input)") && mainJs.includes("/ 100) * 100"), "main.js: 出玉入力の100玉刻み補正がありません");
expect(mainJs.includes("const costPerSpin = 250 / Number(spinPer250.value);"), "main.js: 250玉あたり回転数が投資計算に使われていません");
expect(mainJs.includes("showRetryAd()") && mainJs.includes("ichigekiSimRetryCount"), "main.js: スペックシミュレーターのもう一回広告制御がありません");
expect(exists("CHANGELOG.md"), "CHANGELOG.md が見つかりません");
expect(exists("APP_RELEASE_CHECKLIST.md"), "APP_RELEASE_CHECKLIST.md が見つかりません");
const appChecklist = read("APP_RELEASE_CHECKLIST.md");
for (const word of ["app-ads.txt", "プライバシーポリシーURL", "AdMob", "assetlinks.json", "18歳以上"]) {
  expect(appChecklist.includes(word), `APP_RELEASE_CHECKLIST.md: ${word} の記載がありません`);
}
const readme = read("README.md");
for (const word of ["自動チェックで守っていること", "秘密鍵混入防止", "CSP", "広告ユニットID", "実機表示"]) {
  expect(readme.includes(word), `README.md: ${word} の記載がありません`);
}
for (const word of ["ランキングの差玉", "AdSense審査中", "SUPABASE_SECURITY.md", "security.txt"]) {
  expect(appChecklist.includes(word), `APP_RELEASE_CHECKLIST.md: ${word} の記載がありません`);
}
const changelog = read("CHANGELOG.md");
for (const word of ["お問い合わせ", "運営者情報", "Supabase未読込時", "構造化データ", "PWAアセット"]) {
  expect(changelog.includes(word), `CHANGELOG.md: ${word} の記載がありません`);
}
expect(rankingHtml.includes("normalizeRankingEntry"), "ranking.html: ランキング表示の検査関数がありません");
expect(rankingHtml.includes("diff === score - Number(usedBalls || 0)"), "ranking.html: 差玉検査がありません");
expect(rankingHtml.includes("diff, used_balls"), "ranking.html: 差玉と使用玉を取得していません");
expect(rankingHtml.includes("window.supabase") && rankingHtml.includes("renderRanking([], \"local\")"), "ranking.html: Supabase未読込時のローカル表示がありません");
expect(rankingHtml.includes('data-limit="10"') && rankingHtml.includes('data-limit="30"'), "ranking.html: TOP10/TOP30切り替えがありません");
expect(rankingHtml.includes('data-mode="score"') && rankingHtml.includes('data-mode="chain"') && rankingHtml.includes('data-mode="spins"'), "ranking.html: ランキング種目切り替えが不足しています");
expect(appearsInOrder(rankingHtml, ['data-mode="score"', 'data-mode="chain"', 'data-mode="spins"']), "ranking.html: ランキング種目の順番が想定と違います");
expect(rankingHtml.includes('title: "一撃ランキング"') && rankingHtml.includes('title: "連チャン王"') && rankingHtml.includes('title: "ハマり王"'), "ranking.html: ランキング種目タイトルが不足しています");
expect(rankingHtml.includes('order: "score"') && rankingHtml.includes('order: "chain_count"') && rankingHtml.includes('order: "spins"'), "ranking.html: ランキング並び替え対象が不足しています");
expect(rankingHtml.includes(".podium-card.rank-1 { order: 1;") && rankingHtml.includes(".podium-card.rank-2 { order: 2;") && rankingHtml.includes(".podium-card.rank-3 { order: 3;"), "ranking.html: スマホの表彰台順が1,2,3ではありません");
expect(rankingHtml.includes("mergeRankingData(data)") && rankingHtml.includes("renderPodium(rankingData)"), "ranking.html: ランキング統合/表彰台表示が不足しています");
expect(challengeHtml.includes("window.supabase") && challengeHtml.includes("Supabase client is not available"), "challenge.html: Supabase未読込時のローカル登録 fallback がありません");
expect(challengeHtml.includes('SUPABASE_KEY = "sb_publishable_'), "challenge.html: publishable key が設定されていません");
expect(rankingHtml.includes('SUPABASE_KEY = "sb_publishable_'), "ranking.html: publishable key が設定されていません");
expect(!challengeHtml.includes("service_role") && !rankingHtml.includes("service_role"), "Supabase: service_role key をHTMLへ含めないでください");
const publicSourceFiles = [...new Set([...publicPages, ...scriptFiles, "manifest.json", "netlify.toml"])];
for (const file of publicSourceFiles) {
  const content = read(file);
  expect(!/sb_secret_[A-Za-z0-9_-]+/.test(content), `${file}: Supabase secret key らしき文字列があります`);
  expect(!/SUPABASE_SERVICE_ROLE/i.test(content), `${file}: Supabase service role らしき変数があります`);
  expect(!/service_role/i.test(content), `${file}: service_role を公開ファイルへ含めないでください`);
}
expect(challengeHtml.includes("function isResultConsistent()") && challengeHtml.includes("diff === score - usedBalls"), "challenge.html: 登録前の差玉検査がありません");
expect(challengeHtml.includes("saveLocalRanking(rankingEntry)"), "challenge.html: 登録失敗時のローカル保存がありません");
expect(challengeHtml.includes('maxlength="10"') && challengeHtml.includes("function validateNickname(value)") && challengeHtml.includes("URLや宣伝文は使えません"), "challenge.html: ニックネーム制限が不足しています");
expect(challengeHtml.includes("function buildShareText()") && challengeHtml.includes("navigator.share") && challengeHtml.includes("showManualShareText(shareText)"), "challenge.html: 結果シェア/コピー fallback が不足しています");
expect(challengeHtml.includes("function showAdBeforeRanking") && challengeHtml.includes("ランキングへ進む（3）") && challengeHtml.includes('data-ad-placement="register"'), "challenge.html: 登録後広告導線が不足しています");
expect(challengeHtml.includes('get("start") === "1"') && challengeHtml.includes("requestAnimationFrame"), "challenge.html: ランキングからの自動開始がありません");
expect(challengeHtml.includes("modalChain") && challengeHtml.includes("modalDiff") && challengeHtml.includes("modalUsed"), "challenge.html: 登録モーダルの結果詳細が不足しています");
expect(indexHtml.includes('"publisher"') && indexHtml.includes('"ICHIGEKI運営"'), "index.html: publisher構造化データがありません");
expect(aboutHtml.includes('"@type": "AboutPage"') && aboutHtml.includes('"@type": "Organization"'), "about.html: AboutPage構造化データがありません");
expect(contactHtml.includes('"@type": "ContactPage"') && contactHtml.includes("ichigekipachi@proton.me"), "contact.html: ContactPage構造化データがありません");
expect(offlineHtml.includes('href="sim.html"') && offlineHtml.includes('href="app.html"') && offlineHtml.includes('href="howto.html"'), "offline.html: オフライン時の主要導線が不足しています");
expect(notFoundHtml.includes('href="contact.html"'), "404.html: お問い合わせ導線がありません");

const privacyHtml = read("privacy.html");
const disclaimerHtml = read("disclaimer.html");
const safetyHtml = read("safety.html");
for (const page of ["privacy.html", "disclaimer.html", "safety.html", "contact.html", "about.html"]) {
  const html = read(page);
  expect(html.includes("ichigekipachi@proton.me"), `${page}: 連絡先メールアドレスがありません`);
  expect(html.includes('href="index.html"'), `${page}: トップへ戻る導線がありません`);
}
for (const word of ["Google AdSense", "Google AdMob", "Cookie", "ランキング登録時", "Googleの広告に関するポリシー"]) {
  expect(privacyHtml.includes(word), `privacy.html: ${word} の記載がありません`);
}
for (const word of ["実際のパチンコ・パチスロ機器での結果", "保証", "責任", "お問い合わせ"]) {
  expect(disclaimerHtml.includes(word), `disclaimer.html: ${word} の記載がありません`);
}
for (const word of ["18歳以上", "保証するものではありません", "公的・専門的な支援先", "お問い合わせ"]) {
  expect(safetyHtml.includes(word), `safety.html: ${word} の記載がありません`);
}

for (const word of [
  "create table if not exists public.ranking",
  "alter table public.ranking enable row level security",
  "grant select, insert on public.ranking to anon",
  "revoke update, delete on public.ranking from anon, authenticated",
  "create policy ranking_select",
  "create policy ranking_insert",
  "diff = score - used_balls",
  "char_length(nickname) <= 10",
  "score <= 2000000",
  "used_balls <= 2000000",
  "ranking_diff_matches_score",
  "ranking_nickname_is_clean",
  "ranking_values_are_reasonable",
  "ranking_score_idx",
  "ranking_chain_idx",
  "ranking_spins_idx",
]) {
  expect(supabaseSql.includes(word), `supabase-ranking.sql: ${word} の記載がありません`);
}

for (const word of ["SQL Editor", "Success. No rows returned", "publishable key", "secret key", "service_role key", "差玉"]) {
  expect(supabaseSecurity.includes(word), `SUPABASE_SECURITY.md: ${word} の記載がありません`);
}

const googleSellerLine = "google.com, pub-2599640417413447, DIRECT, f08c47fec0942fa0";
expect(read("ads.txt").trim() === googleSellerLine, "ads.txt: Google販売者情報が想定と違います");
expect(read("app-ads.txt").trim() === googleSellerLine, "app-ads.txt: Google販売者情報が想定と違います");

const adsConfig = read("ads-config.js");
const adsJs = read("ads.js");
expect(adsConfig.includes("enabled: true"), "ads-config.js: 広告が有効になっていません");
expect(adsConfig.includes('provider: "adsense"'), "ads-config.js: provider が adsense ではありません");
expect(adsConfig.includes('adsenseClient: "ca-pub-2599640417413447"'), "ads-config.js: AdSenseクライアントIDが想定と違います");
expect(adsConfig.includes("footer:") && adsConfig.includes("register:"), "ads-config.js: footer/register slot がありません");
expect(adsConfig.includes('footer: ""') && adsConfig.includes('register: ""'), "ads-config.js: 審査中の空広告ユニットID状態が想定と違います");
expect(adsJs.includes("data-ad-placement") && adsJs.includes("adsbygoogle") && adsJs.includes("広告枠"), "ads.js: 広告描画/fallback処理が不足しています");
expect(adsJs.includes("slots[slotName]") && adsJs.includes("hasAdsenseConfig(slotName)"), "ads.js: 広告ユニットID未設定時の表示ガードがありません");
expect(adsJs.includes('script[data-ichigeki-adsense]') && adsJs.includes("scriptLoading"), "ads.js: AdSense loader の重複読み込み防止がありません");
expect(adsJs.includes('target.classList.remove("ad-live")') && adsJs.includes('<span>AD</span>広告枠'), "ads.js: 広告読み込み失敗時のfallbackがありません");
expect(adsJs.includes("window.adsbygoogle.push({})"), "ads.js: AdSense表示開始処理がありません");
expect(styleCss.includes(".footer-ad-band") && styleCss.includes("position: fixed") && styleCss.includes("env(safe-area-inset-bottom)"), "style.css: フッター広告の画面下固定設定が不足しています");
expect(styleCss.includes("body") && styleCss.includes("padding-bottom: 118px"), "style.css: フッター広告ぶんの下余白が不足しています");
expect(styleCss.includes(".footer-ad-band.ad-live") && styleCss.includes(".footer-ad-band .adsbygoogle"), "style.css: AdSense表示時のフッター広告スタイルが不足しています");
expect(appHtml.includes(".footer-ad-band") && appHtml.includes("position: fixed") && appHtml.includes("env(safe-area-inset-bottom)"), "app.html: 実戦ページのフッター広告固定設定が不足しています");

for (const page of publicPages) {
  const html = read(page);
  expect(html.includes('class="footer-ad-band"') && html.includes('data-ad-placement="footer"'), `${page}: フッター広告枠がありません`);
}

for (const page of adPages) {
  const html = read(page);
  expect(html.includes('src="ads-config.js"'), `${page}: ads-config.js が読み込まれていません`);
  expect(html.includes('src="ads.js"'), `${page}: ads.js が読み込まれていません`);
}

for (const page of sharePages) {
  expect(read(page).includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"), `${page}: AdSense loader がありません`);
}

for (const page of ["challenge.html", "sim.html"]) {
  expect(read(page).includes('data-ad-placement="register"'), `${page}: 登録/継続用広告枠がありません`);
}

const securityTxt = read(".well-known/security.txt");
expect(securityTxt.includes("Contact: mailto:ichigekipachi@proton.me"), "security.txt: Contact がありません");
expect(securityTxt.includes("Expires: 2027-05-17T00:00:00.000Z"), "security.txt: Expires がありません");
expect(securityTxt.includes("Preferred-Languages: ja"), "security.txt: Preferred-Languages がありません");
expect(securityTxt.includes("Canonical: https://ichigekipachi.netlify.app/.well-known/security.txt"), "security.txt: Canonical がありません");

const sitemap = read("sitemap.xml");
const sitemapEntries = extractSitemapEntries(sitemap);
const sitemapUrls = sitemapEntries.map(entry => entry.loc);
const expectedSitemapUrls = sharePages.map(expectedPageUrl);

expect(sitemapEntries.length === expectedSitemapUrls.length, "sitemap.xml: 公開対象URL数が想定と違います");
for (const page of sharePages) {
  const url = expectedPageUrl(page);
  expect(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: ${url} がありません`);
}

for (const url of sitemapUrls) {
  expect(expectedSitemapUrls.includes(url), `sitemap.xml: 想定外のURL ${url} が含まれています`);
}

expect(new Set(sitemapUrls).size === sitemapUrls.length, "sitemap.xml: URLが重複しています");

for (const entry of sitemapEntries) {
  expect(/^https:\/\/ichigekipachi\.netlify\.app\/(?:[a-z0-9-]+\.html)?$/.test(entry.loc), `sitemap.xml: loc の形式が想定と違います (${entry.loc})`);
  expect(/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod), `sitemap.xml: ${entry.loc} の lastmod が YYYY-MM-DD ではありません`);
  expect(["daily", "weekly", "monthly", "yearly"].includes(entry.changefreq), `sitemap.xml: ${entry.loc} の changefreq が想定外です`);
  expect(/^(?:0\.[1-9]|1\.0)$/.test(entry.priority), `sitemap.xml: ${entry.loc} の priority が想定外です`);
}

for (const page of noindexPages) {
  const url = expectedPageUrl(page);
  expect(!sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: noindex の ${url} が含まれています`);
}

const robots = read("robots.txt");
expect(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), "robots.txt: Sitemap がありません");

const netlify = read("netlify.toml");
expect(netlify.includes('publish = "."'), "netlify.toml: publish設定が想定と違います");
for (const header of [
  "Content-Security-Policy",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Strict-Transport-Security",
  "Permissions-Policy",
]) {
  expect(netlify.includes(header), `netlify.toml: ${header} がありません`);
}
for (const source of [
  "https://pagead2.googlesyndication.com",
  "https://googleads.g.doubleclick.net",
  "https://cdn.jsdelivr.net",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://qkacufmyiljfojlqrmke.supabase.co",
]) {
  expect(netlify.includes(source), `netlify.toml: CSPに ${source} がありません`);
}
for (const file of ["/ads.txt", "/app-ads.txt", "/.well-known/security.txt"]) {
  expect(netlify.includes(`for = "${file}"`), `netlify.toml: ${file} のheaders設定がありません`);
}
expect(netlify.includes('Content-Type = "text/plain; charset=utf-8"'), "netlify.toml: text/plain のContent-Type設定がありません");
expect(netlify.includes('for = "/sw.js"') && netlify.includes("no-cache, no-store, must-revalidate"), "netlify.toml: sw.js のno-cache設定がありません");
expect(netlify.includes('for = "/manifest.json"') && netlify.includes("public, max-age=3600"), "netlify.toml: manifest.json のキャッシュ設定がありません");

const sw = read("sw.js");
expect(/const CACHE_NAME = "ichigeki-pwa-v\d+";/.test(sw), "sw.js: CACHE_NAME の形式が想定と違います");
for (const file of publicPages) {
  expect(sw.includes(`"/${file}"`), `sw.js: /${file} がキャッシュ対象にありません`);
}

const cachedAssets = extractQuotedPaths(sw).filter(value => value.startsWith("/"));
for (const asset of cachedAssets) {
  const file = normalizeLocalReference(asset);
  if (!file) continue;
  expect(exists(file), `sw.js: キャッシュ対象の ${asset} が見つかりません`);
}

for (const asset of ["/style.css", "/main.js", "/presets.js", "/ads-config.js", "/ads.js", "/pwa.js", "/manifest.json"]) {
  expect(cachedAssets.includes(asset), `sw.js: ${asset} がキャッシュ対象にありません`);
}

if (errors.length) {
  console.error("Smoke check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Smoke check passed.");
