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
  "privacy.html",
  "disclaimer.html",
];

const requiredFiles = [
  "manifest.json",
  "sw.js",
  "robots.txt",
  "sitemap.xml",
  "ads.txt",
  "app-ads.txt",
  ".well-known/security.txt",
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

function expect(condition, message) {
  if (!condition) errors.push(message);
}

function has(html, pattern) {
  return pattern.test(html);
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
}

for (const page of sharePages) {
  const html = read(page);
  expect(has(html, /property="og:title"/), `${page}: og:title がありません`);
  expect(has(html, /property="og:description"/), `${page}: og:description がありません`);
  expect(has(html, /property="og:image"/), `${page}: og:image がありません`);
  expect(has(html, /name="twitter:card"/), `${page}: twitter:card がありません`);
  expect(has(html, /<link rel="canonical"/), `${page}: canonical がありません`);
}

const manifest = JSON.parse(read("manifest.json"));
expect(manifest.name === "ICHIGEKI 一撃スロパチ", "manifest: name が想定と違います");
expect(manifest.short_name === "一撃スロパチ", "manifest: short_name が想定と違います");
expect(manifest.display === "standalone", "manifest: display が standalone ではありません");
expect(Array.isArray(manifest.icons) && manifest.icons.length >= 3, "manifest: icons が不足しています");
expect(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, "manifest: shortcuts が不足しています");
expect(Array.isArray(manifest.screenshots) && manifest.screenshots.length >= 2, "manifest: screenshots が不足しています");

const googleSellerLine = "google.com, pub-2599640417413447, DIRECT, f08c47fec0942fa0";
expect(read("ads.txt").trim() === googleSellerLine, "ads.txt: Google販売者情報が想定と違います");
expect(read("app-ads.txt").trim() === googleSellerLine, "app-ads.txt: Google販売者情報が想定と違います");

const securityTxt = read(".well-known/security.txt");
expect(securityTxt.includes("Contact: mailto:ichigekipachi@proton.me"), "security.txt: Contact がありません");
expect(securityTxt.includes("Canonical: https://ichigekipachi.netlify.app/.well-known/security.txt"), "security.txt: Canonical がありません");

const sitemap = read("sitemap.xml");
for (const page of sharePages) {
  const url = page === "index.html"
    ? "https://ichigekipachi.netlify.app/"
    : `https://ichigekipachi.netlify.app/${page}`;
  expect(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: ${url} がありません`);
}

const sw = read("sw.js");
for (const file of ["index.html", "sim.html", "app.html", "ranking.html", "challenge.html", "offline.html", "404.html"]) {
  expect(sw.includes(`"/${file}"`), `sw.js: /${file} がキャッシュ対象にありません`);
}

if (errors.length) {
  console.error("Smoke check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Smoke check passed.");
