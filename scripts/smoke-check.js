const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

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

function extractQuotedPaths(text) {
  return [...text.matchAll(/"([^"]+)"/g)].map(match => match[1]);
}

for (const file of requiredFiles) {
  expect(exists(file), `${file} が見つかりません`);
}

for (const page of publicPages) {
  expect(exists(page), `${page} が見つかりません`);
  if (!exists(page)) continue;

  const html = read(page);
  expect(has(html, /<html lang="ja">/), `${page}: lang="ja" がありません`);
  expect(has(html, /<meta name="viewport"/), `${page}: viewport がありません`);
  expect(has(html, /<meta name="description"/), `${page}: description がありません`);
  expect(has(html, /<title>.+<\/title>/), `${page}: title がありません`);
  expect(has(html, /<link rel="manifest"/), `${page}: manifest link がありません`);
  expect(has(html, /<link rel="icon"/), `${page}: icon link がありません`);
  expect(has(html, /<link rel="apple-touch-icon"/), `${page}: apple-touch-icon link がありません`);

  const localRefs = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)]
    .map(match => match[1])
    .filter(isLocalReference)
    .map(normalizeLocalReference)
    .filter(Boolean);

  for (const ref of localRefs) {
    expect(exists(ref), `${page}: ${ref} が見つかりません`);
  }
}

for (const page of sharePages) {
  const html = read(page);
  expect(has(html, /property="og:title"/), `${page}: og:title がありません`);
  expect(has(html, /property="og:description"/), `${page}: og:description がありません`);
  expect(has(html, /property="og:image"/), `${page}: og:image がありません`);
  expect(has(html, /name="twitter:card"/), `${page}: twitter:card がありません`);
  expect(has(html, /<link rel="canonical"/), `${page}: canonical がありません`);
}

for (const page of noindexPages) {
  const html = read(page);
  expect(has(html, /<meta name="robots" content="noindex"/), `${page}: noindex がありません`);
}

const manifest = JSON.parse(read("manifest.json"));
const pkg = JSON.parse(read("package.json"));
const indexHtml = read("index.html");
const howtoHtml = read("howto.html");
const rankingHtml = read("ranking.html");
const challengeHtml = read("challenge.html");
const aboutHtml = read("about.html");
const contactHtml = read("contact.html");
const offlineHtml = read("offline.html");
const notFoundHtml = read("404.html");
expect(manifest.name === "ICHIGEKI 一撃スロパチ", "manifest: name が想定と違います");
expect(manifest.short_name === "一撃スロパチ", "manifest: short_name が想定と違います");
expect(manifest.display === "standalone", "manifest: display が standalone ではありません");
expect(Array.isArray(manifest.icons) && manifest.icons.length >= 3, "manifest: icons が不足しています");
expect(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, "manifest: shortcuts が不足しています");
expect(Array.isArray(manifest.screenshots) && manifest.screenshots.length >= 2, "manifest: screenshots が不足しています");
expect(
  manifest.shortcuts.slice(0, 3).map(shortcut => shortcut.url).join(",") === "/ranking.html,/app.html,/sim.html",
  "manifest: shortcuts の順番が想定と違います"
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
expect(indexHtml.includes("v2.0"), "index.html: 表示バージョン v2.0 がありません");
expect(
  appearsInOrder(indexHtml, ["全国チャレンジ", "実戦シミュレーター", "スペックシミュレーター", "使い方", "エンターテインメント専用", "スマホに追加"]),
  "index.html: TOP導線の順番が想定と違います"
);
expect(
  appearsInOrder(howtoHtml, ["全国チャレンジ", "実戦シミュレーター", "スペックシミュレーター"]),
  "howto.html: モード説明の順番が想定と違います"
);
expect(exists("CHANGELOG.md"), "CHANGELOG.md が見つかりません");
expect(exists("APP_RELEASE_CHECKLIST.md"), "APP_RELEASE_CHECKLIST.md が見つかりません");
const appChecklist = read("APP_RELEASE_CHECKLIST.md");
for (const word of ["app-ads.txt", "プライバシーポリシーURL", "AdMob", "assetlinks.json", "18歳以上"]) {
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
expect(challengeHtml.includes("window.supabase") && challengeHtml.includes("Supabase client is not available"), "challenge.html: Supabase未読込時のローカル登録 fallback がありません");
expect(indexHtml.includes('"publisher"') && indexHtml.includes('"ICHIGEKI運営"'), "index.html: publisher構造化データがありません");
expect(aboutHtml.includes('"@type": "AboutPage"') && aboutHtml.includes('"@type": "Organization"'), "about.html: AboutPage構造化データがありません");
expect(contactHtml.includes('"@type": "ContactPage"') && contactHtml.includes("ichigekipachi@proton.me"), "contact.html: ContactPage構造化データがありません");
expect(offlineHtml.includes('href="sim.html"') && offlineHtml.includes('href="app.html"') && offlineHtml.includes('href="howto.html"'), "offline.html: オフライン時の主要導線が不足しています");
expect(notFoundHtml.includes('href="contact.html"'), "404.html: お問い合わせ導線がありません");

const googleSellerLine = "google.com, pub-2599640417413447, DIRECT, f08c47fec0942fa0";
expect(read("ads.txt").trim() === googleSellerLine, "ads.txt: Google販売者情報が想定と違います");
expect(read("app-ads.txt").trim() === googleSellerLine, "app-ads.txt: Google販売者情報が想定と違います");

const securityTxt = read(".well-known/security.txt");
expect(securityTxt.includes("Contact: mailto:ichigekipachi@proton.me"), "security.txt: Contact がありません");
expect(securityTxt.includes("Expires: 2027-05-17T00:00:00.000Z"), "security.txt: Expires がありません");
expect(securityTxt.includes("Preferred-Languages: ja"), "security.txt: Preferred-Languages がありません");
expect(securityTxt.includes("Canonical: https://ichigekipachi.netlify.app/.well-known/security.txt"), "security.txt: Canonical がありません");

const sitemap = read("sitemap.xml");
for (const page of sharePages) {
  const url = page === "index.html"
    ? "https://ichigekipachi.netlify.app/"
    : `https://ichigekipachi.netlify.app/${page}`;
  expect(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: ${url} がありません`);
}

for (const page of noindexPages) {
  const url = `https://ichigekipachi.netlify.app/${page}`;
  expect(!sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: noindex の ${url} が含まれています`);
}

const robots = read("robots.txt");
expect(robots.includes("Sitemap: https://ichigekipachi.netlify.app/sitemap.xml"), "robots.txt: Sitemap がありません");

const netlify = read("netlify.toml");
for (const file of ["/ads.txt", "/app-ads.txt", "/.well-known/security.txt"]) {
  expect(netlify.includes(`for = "${file}"`), `netlify.toml: ${file} のheaders設定がありません`);
}
expect(netlify.includes('Content-Type = "text/plain; charset=utf-8"'), "netlify.toml: text/plain のContent-Type設定がありません");
expect(netlify.includes('for = "/sw.js"') && netlify.includes("no-cache, no-store, must-revalidate"), "netlify.toml: sw.js のno-cache設定がありません");

const sw = read("sw.js");
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
