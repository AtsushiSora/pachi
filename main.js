// ========================
// 状態
// ========================
let spinning = false;
const logs = [];

// ========================
// 画面要素
// ========================
const settingScreen = document.getElementById("settingScreen");
const playScreen    = document.getElementById("playScreen");
const spinDisplay   = document.getElementById("spinDisplay");
const chain         = document.getElementById("chain");
const used          = document.getElementById("used");
const total         = document.getElementById("total");
const balance       = document.getElementById("balance");
const log           = document.getElementById("log");
const payoutEffect  = document.getElementById("payout-effect");
const modeTag       = document.getElementById("modeTag");
const playStatus    = document.getElementById("playStatus");
const hitSound      = document.getElementById("hitSound");
const rushSound     = document.getElementById("rushSound");
const ratioTotal    = document.getElementById("ratioTotal");
const ratioRemain   = document.getElementById("ratioRemain");
const ltRatioTotal  = document.getElementById("ltRatioTotal");
const ltRatioRemain = document.getElementById("ltRatioRemain");

// ========================
// ±ボタン
// ========================
document.querySelectorAll(".step-btn").forEach(btn => {
  btn.addEventListener("click", () => changeValue(btn));
});

// ========================
// 数値変更
// ========================
function changeValue(button) {
  const target = document.getElementById(button.dataset.target);
  let value = Number(target.value);
  value += Number(button.dataset.change);
  if (value < 0) value = 0;

  // 通常割合上限
  if (["ratio1","ratio2","ratio3","ratio4"].includes(target.id)) {
    const others =
      (target.id !== "ratio1" ? Number(ratio1.value) : 0) +
      (enablePayout2.checked && target.id !== "ratio2" ? Number(ratio2.value) : 0) +
      (enablePayout3.checked && target.id !== "ratio3" ? Number(ratio3.value) : 0) +
      (enablePayout4.checked && target.id !== "ratio4" ? Number(ratio4.value) : 0);
    if (value + others > 100) value = 100 - others;
  }

  // LT割合上限
  if (["ltRatio1","ltRatio2"].includes(target.id)) {
    const others =
      (enableLtPayout1.checked && target.id !== "ltRatio1" ? Number(ltRatio1.value) : 0) +
      (enableLtPayout2.checked && target.id !== "ltRatio2" ? Number(ltRatio2.value) : 0);
    if (value + others > 100) value = 100 - others;
  }

  target.value = value;
  updateRatioTotal();
  saveSettings();
}

// ========================
// 割合更新
// ========================
function updateRatioTotal() {
  const normalTotal =
    Number(ratio1.value) +
    (enablePayout2.checked ? Number(ratio2.value) : 0) +
    (enablePayout3.checked ? Number(ratio3.value) : 0) +
    (enablePayout4.checked ? Number(ratio4.value) : 0);

  ratioTotal.textContent  = `合計 ${normalTotal}%`;
  ratioRemain.textContent = `残り ${100 - normalTotal}%`;
  ratioRemain.className   = normalTotal === 100 ? "ok" : "over";

  const ltTotal =
    (enableLtPayout1.checked ? Number(ltRatio1.value) : 0) +
    (enableLtPayout2.checked ? Number(ltRatio2.value) : 0);

  ltRatioTotal.textContent  = `合計 ${ltTotal}%`;
  ltRatioRemain.textContent = `残り ${100 - ltTotal}%`;
  ltRatioRemain.className   = ltTotal === 100 ? "ok" : "over";
}

// ========================
// 設定保存
// ========================
function saveSettings() {
  document.querySelectorAll("input").forEach(input => {
    localStorage.setItem(
      input.id,
      input.type === "checkbox" ? input.checked : input.value
    );
  });
}

// ========================
// 設定読込
// ========================
function loadSettings() {
  document.querySelectorAll("input").forEach(input => {
    const saved = localStorage.getItem(input.id);
    if (saved !== null) {
      if (input.type === "checkbox") input.checked = saved === "true";
      else input.value = saved;
    }
  });
}

// ========================
// ログ追加
// ========================
function addLog(text, cls = "log-normal") {
  const div = document.createElement("div");
  div.className = cls;
  div.textContent = text;
  log.appendChild(div);
  if (log.children.length > 60) log.removeChild(log.firstChild);
  log.parentElement.scrollTop = log.parentElement.scrollHeight;
}

// ========================
// ランダム
// ========================
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========================
// 数値表示ヘルパー
// ========================
function setVal(el, num, unit, cls) {
  el.innerHTML = `${num.toLocaleString()}<span class="stat-u">${unit}</span>`;
  if (cls) el.className = `stat-val ${cls}`;
}

// ========================
// モード表示
// ========================
function setMode(mode) {
  modeTag.className = `mode-tag mode-${mode}`;
  if (mode === "normal") modeTag.textContent = "通常";
  if (mode === "rush")   modeTag.textContent = "RUSH";
  if (mode === "lt")     modeTag.textContent = "LT RUSH";
}

// ========================
// 演出
// ========================
function showPayoutEffect(amount) {
  payoutEffect.textContent = `+${amount.toLocaleString()}`;
  payoutEffect.classList.remove("show");
  void payoutEffect.offsetWidth;
  payoutEffect.classList.add("show");

  document.body.classList.add("body-flash");
  setTimeout(() => document.body.classList.remove("body-flash"), 350);
}

// ========================
// sleep
// ========================
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ========================
// プリセット
// ========================
function setPreset(type) {
  const p = {
    eva:      { hitRate:319, breakRate:70,  continueRate:81, spinPer250:17,
                p1:1500, r1:50,  p2:3000, r2:30,  p3:4500, r3:15,  p4:6000, r4:5,
                e2:true,  e3:true,  e4:true,
                lt:true,  ltRate:20, ltCont:95,
                lp1:3000, lr1:80, lp2:4500, lr2:20, le1:true, le2:true },
    rezero:   { hitRate:349, breakRate:55,  continueRate:77, spinPer250:17,
                p1:1500, r1:100, p2:3000, r2:0,   p3:4500, r3:0,   p4:6000, r4:0,
                e2:false, e3:false, e4:false,
                lt:true,  ltRate:35, ltCont:92,
                lp1:3000, lr1:90, lp2:6000, lr2:10, le1:true, le2:true },
    arami:    { hitRate:399, breakRate:50,  continueRate:76, spinPer250:17,
                p1:1500, r1:70,  p2:3000, r2:20,  p3:6000, r3:10,  p4:6000, r4:0,
                e2:true,  e3:true,  e4:false,
                lt:true,  ltRate:30, ltCont:88,
                lp1:3000, lr1:70, lp2:6000, lr2:30, le1:true, le2:true },
    ama:      { hitRate:99,  breakRate:65,  continueRate:70, spinPer250:20,
                p1:1000, r1:100, p2:3000, r2:0,   p3:4500, r3:0,   p4:6000, r4:0,
                e2:false, e3:false, e4:false,
                lt:false, ltRate:20, ltCont:95,
                lp1:3000, lr1:80, lp2:4500, lr2:20, le1:true, le2:true },
    umi:      { hitRate:249, breakRate:60,  continueRate:73, spinPer250:17,
                p1:1500, r1:80,  p2:3000, r2:20,  p3:4500, r3:0,   p4:6000, r4:0,
                e2:true,  e3:false, e4:false,
                lt:false, ltRate:20, ltCont:95,
                lp1:3000, lr1:80, lp2:4500, lr2:20, le1:true, le2:true },
    karakuri: { hitRate:319, breakRate:65,  continueRate:80, spinPer250:17,
                p1:2000, r1:60,  p2:4000, r2:30,  p3:6000, r3:10,  p4:6000, r4:0,
                e2:true,  e3:true,  e4:false,
                lt:true,  ltRate:35, ltCont:95,
                lp1:4500, lr1:70, lp2:9000, lr2:30, le1:true, le2:true },
    boukyou:  { hitRate:319, breakRate:60,  continueRate:75, spinPer250:17,
                p1:3000, r1:100, p2:3000, r2:0,   p3:4500, r3:0,   p4:6000, r4:0,
                e2:false, e3:false, e4:false,
                lt:false, ltRate:20, ltCont:95,
                lp1:3000, lr1:80, lp2:4500, lr2:20, le1:true, le2:true },
    madoka:   { hitRate:199, breakRate:75,  continueRate:82, spinPer250:17,
                p1:1500, r1:60,  p2:3000, r2:30,  p3:4500, r3:10,  p4:6000, r4:0,
                e2:true,  e3:true,  e4:false,
                lt:true,  ltRate:20, ltCont:92,
                lp1:3000, lr1:80, lp2:6000, lr2:20, le1:true, le2:true },
  };
  const s = p[type];
  if (!s) return;
  hitRate.value = s.hitRate;  breakRate.value = s.breakRate;
  continueRate.value = s.continueRate; spinPer250.value = s.spinPer250;
  payout1.value = s.p1; ratio1.value = s.r1;
  payout2.value = s.p2; ratio2.value = s.r2;
  payout3.value = s.p3; ratio3.value = s.r3;
  payout4.value = s.p4; ratio4.value = s.r4;
  enablePayout2.checked = s.e2; enablePayout3.checked = s.e3; enablePayout4.checked = s.e4;
  ltEnabled.checked = s.lt; ltRate.value = s.ltRate; ltContinueRate.value = s.ltCont;
  ltPayout1.value = s.lp1; ltRatio1.value = s.lr1;
  ltPayout2.value = s.lp2; ltRatio2.value = s.lr2;
  enableLtPayout1.checked = s.le1; enableLtPayout2.checked = s.le2;
  updateRatioTotal();
  saveSettings();
}

// ========================
// ボタンイベント
// ========================
document.getElementById("startBtn").addEventListener("click", simulate);
document.getElementById("retryBtn").addEventListener("click", simulate);
document.getElementById("backBtn").addEventListener("click", () => {
  spinning = false;
  playScreen.style.display    = "none";
  settingScreen.style.display = "block";
});

// ========================
// シミュレーション
// ========================
async function simulate() {
  if (spinning) return;
  spinning = true;

  // リセット
  log.innerHTML = "";
  logs.length = 0;
  payoutEffect.textContent = "";
  payoutEffect.classList.remove("show");
  document.body.classList.remove("body-flash");
  document.getElementById("retryBtn").style.display = "none";
  setMode("normal");
  setVal(chain,   0, "回");
  setVal(total,   0, "玉", "val-up");
  setVal(used,    0, "玉", "val-dim");
  setVal(balance, 0, "玉");
  spinDisplay.textContent = "0回転";
  spinDisplay.classList.remove("warning");
  playStatus.textContent = "実行中";

  settingScreen.style.display = "none";
  playScreen.style.display    = "block";

  let spins       = 0;
  let totalPayout = 0;
  let chainCount  = 0;
  const costPerSpin = 250 / Number(spinPer250.value);

  // ========================
  // 通常ループ
  // ========================
  while (spinning) {
    spins++;
    spinDisplay.innerHTML = `${spins.toLocaleString()}<span class="spin-unit">回転</span>`;

    if (spins >= 1000) spinDisplay.classList.add("warning");

    const hit = Math.random() < (1 / Number(hitRate.value));

    if (hit) {
      spinDisplay.classList.remove("warning");
      hitSound.currentTime = 0;
      hitSound.play().catch(() => {});

      addLog(`${spins.toLocaleString()}回転で当たり！`, "log-hit");

      const breakthrough = Math.random() < (Number(breakRate.value) / 100);
      if (!breakthrough) {
        addLog("突破失敗…", "log-fail");
        break;
      }

      rushSound.currentTime = 0;
      rushSound.play().catch(() => {});
      addLog("RUSH突入！", "log-rush");

      // LT判定
      let isLT = false;
      if (ltEnabled.checked && Math.random() < (Number(ltRate.value) / 100)) {
        isLT = true;
        addLog("⚡ LT突入！！", "log-lt");
      }

      setMode(isLT ? "lt" : "rush");

      // ========================
      // RUSHループ
      // ========================
      let rush = true;
      while (rush && spinning) {
        const rand = Math.random() * 100;
        let payout = 0;

        const pool = isLT
          ? [
              { en: enableLtPayout1.checked, val: Number(ltPayout1.value), ratio: Number(ltRatio1.value) },
              { en: enableLtPayout2.checked, val: Number(ltPayout2.value), ratio: Number(ltRatio2.value) },
            ]
          : [
              { en: true,                    val: Number(payout1.value),   ratio: Number(ratio1.value) },
              { en: enablePayout2.checked,   val: Number(payout2.value),   ratio: Number(ratio2.value) },
              { en: enablePayout3.checked,   val: Number(payout3.value),   ratio: Number(ratio3.value) },
              { en: enablePayout4.checked,   val: Number(payout4.value),   ratio: Number(ratio4.value) },
            ];

        let cum = 0;
        for (const item of pool) {
          if (!item.en) continue;
          cum += item.ratio;
          if (rand < cum) {
            payout = randomRange(item.val - 100, item.val + 100);
            break;
          }
        }

        chainCount++;
        totalPayout += payout;
        const usedNow = Math.floor(spins * costPerSpin);
        const diff    = totalPayout - usedNow;

        setVal(chain,   chainCount,         "回",  "val-hi");
        setVal(total,   totalPayout,        "玉",  "val-up");
        setVal(used,    usedNow,            "玉",  "val-dim");
        setVal(balance, Math.abs(diff),     "玉",  diff >= 0 ? "val-up" : "val-dn");

        showPayoutEffect(payout);
        addLog(`+${payout.toLocaleString()}玉`, "log-payout");

        await sleep(700);

        // 継続判定
        const contRate = isLT ? Number(ltContinueRate.value) : Number(continueRate.value);
        if (Math.random() >= contRate / 100) {
          rush = false;
          setMode("normal");
          addLog("RUSH終了", "log-end");
        }
      }
      break;
    }

    if (spins % 300 === 0) addLog(`${spins.toLocaleString()}回転…`, "log-hama");
    await sleep(1);
  }

  spinning = false;

  // 最終集計
  const usedBalls = Math.floor(spins * costPerSpin);
  const diff      = totalPayout - usedBalls;
  setVal(used,    usedBalls,       "玉", "val-dim");
  setVal(balance, Math.abs(diff),  "玉", diff >= 0 ? "val-up" : "val-dn");

  addLog(
    diff >= 0
      ? `結果 +${diff.toLocaleString()}玉`
      : `結果 -${Math.abs(diff).toLocaleString()}玉`,
    diff >= 0 ? "log-payout" : "log-fail"
  );

  playStatus.textContent = "完了";
  document.getElementById("retryBtn").style.display = "block";
}

// ========================
// 初期化
// ========================
loadSettings();
updateRatioTotal();
