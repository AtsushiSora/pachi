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
const retryBtn      = document.getElementById("retryBtn");
const simAdOverlay  = document.getElementById("simAdOverlay");
const simAdNextBtn  = document.getElementById("simAdNextBtn");
const startBtn      = document.getElementById("startBtn");
const backBtn       = document.getElementById("backBtn");
const hitRate       = document.getElementById("hitRate");
const breakRate     = document.getElementById("breakRate");
const breakPayout   = document.getElementById("breakPayout");
const failPayout    = document.getElementById("failPayout");
const continueRate  = document.getElementById("continueRate");
const spinPer250    = document.getElementById("spinPer250");
const payout1       = document.getElementById("payout1");
const payout2       = document.getElementById("payout2");
const payout3       = document.getElementById("payout3");
const payout4       = document.getElementById("payout4");
const ratio1        = document.getElementById("ratio1");
const ratio2        = document.getElementById("ratio2");
const ratio3        = document.getElementById("ratio3");
const ratio4        = document.getElementById("ratio4");
const enablePayout2 = document.getElementById("enablePayout2");
const enablePayout3 = document.getElementById("enablePayout3");
const enablePayout4 = document.getElementById("enablePayout4");
const ltEnabled     = document.getElementById("ltEnabled");
const ltRate        = document.getElementById("ltRate");
const ltContinueRate = document.getElementById("ltContinueRate");
const ltPayout1     = document.getElementById("ltPayout1");
const ltPayout2     = document.getElementById("ltPayout2");
const ltRatio1      = document.getElementById("ltRatio1");
const ltRatio2      = document.getElementById("ltRatio2");
const enableLtPayout1 = document.getElementById("enableLtPayout1");
const enableLtPayout2 = document.getElementById("enableLtPayout2");
let retryCount      = Number(sessionStorage.getItem("ichigekiSimRetryCount") || 0);

// ========================
// ±ボタン
// ========================
document.querySelectorAll(".step-btn").forEach(btn => {
  btn.addEventListener("click", () => changeValue(btn));
});

document.querySelectorAll(".setting-slider").forEach(slider => {
  slider.addEventListener("input", () => {
    const target = document.getElementById(slider.dataset.target);
    target.value = clampRatioValue(target.id, Number(slider.value));
    if (isPayoutInput(target.id)) snapPayoutInput(target);
    syncSettingSlider(target.id);
    updateRatioTotal();
    saveSettings();
  });
});

document.querySelectorAll("input[type='number']").forEach(input => {
  input.addEventListener("input", () => {
    syncSettingSlider(input.id);
    updateRatioTotal();
    saveSettings();
  });
  input.addEventListener("change", () => {
    snapPayoutInput(input);
    syncSettingSlider(input.id);
    saveSettings();
  });
});

// ========================
// 数値変更
// ========================
function changeValue(button) {
  const target = document.getElementById(button.dataset.target);
  let value = Number(target.value);
  value += Number(button.dataset.change);
  if (value < 0) value = 0;

  value = clampRatioValue(target.id, value);

  target.value = value;
  syncSettingSlider(target.id);
  updateRatioTotal();
  saveSettings();
}

function clampRatioValue(targetId, value) {
  // 通常割合上限
  if (["ratio1","ratio2","ratio3","ratio4"].includes(targetId)) {
    const others =
      (targetId !== "ratio1" ? Number(ratio1.value) : 0) +
      (enablePayout2.checked && targetId !== "ratio2" ? Number(ratio2.value) : 0) +
      (enablePayout3.checked && targetId !== "ratio3" ? Number(ratio3.value) : 0) +
      (enablePayout4.checked && targetId !== "ratio4" ? Number(ratio4.value) : 0);
    if (value + others > 100) return 100 - others;
  }

  // LT割合上限
  if (["ltRatio1","ltRatio2"].includes(targetId)) {
    const others =
      (enableLtPayout1.checked && targetId !== "ltRatio1" ? Number(ltRatio1.value) : 0) +
      (enableLtPayout2.checked && targetId !== "ltRatio2" ? Number(ltRatio2.value) : 0);
    if (value + others > 100) return 100 - others;
  }

  return value;
}

function syncSettingSlider(targetId) {
  const slider = document.querySelector(`.setting-slider[data-target="${targetId}"]`);
  if (!slider) return;
  slider.value = document.getElementById(targetId).value;
}

function syncSettingSliders() {
  document.querySelectorAll(".setting-slider").forEach(slider => {
    const target = document.getElementById(slider.dataset.target);
    if (target) slider.value = target.value;
  });
}

function isPayoutInput(id) {
  return ["breakPayout","failPayout","payout1","payout2","payout3","payout4","ltPayout1","ltPayout2"].includes(id);
}

function snapPayoutInput(input) {
  if (!isPayoutInput(input.id)) return;
  input.value = Math.max(0, Math.round(Number(input.value || 0) / 100) * 100);
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
    if (!input.id) return;
    const value = input.type === "checkbox" ? input.checked : input.value;
    localStorage.setItem(input.id, String(value));
  });
}

// ========================
// 設定読込
// ========================
function loadSettings() {
  document.querySelectorAll("input").forEach(input => {
    if (!input.id) return;
    const saved = localStorage.getItem(input.id);
    if (saved === null || saved.startsWith("U2FsdGVk")) return;
    if (input.type === "checkbox") input.checked = saved === "true";
    else input.value = saved;
  });
  syncSettingSliders();
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

function applyPayout(amount, label, state) {
  if (amount <= 0) return;
  state.chainCount++;
  state.totalPayout += amount;
  const usedNow = Math.floor(state.spins * state.costPerSpin);
  const diff    = state.totalPayout - usedNow;

  setVal(chain,   state.chainCount,  "回",  "val-hi");
  setVal(total,   state.totalPayout, "玉",  "val-up");
  setVal(used,    usedNow,           "玉",  "val-dim");
  setVal(balance, Math.abs(diff),    "玉",  diff >= 0 ? "val-up" : "val-dn");

  showPayoutEffect(amount);
  addLog(`${label} +${amount.toLocaleString()}玉`, "log-payout");
}

// ========================
// sleep
// ========================
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ========================
// プリセット（データは presets.js）
// ========================
function setPreset(type) {
  const s = PRESETS[type];
  if (!s) return;
  hitRate.value = s.hitRate;  breakRate.value = s.breakRate;
  continueRate.value = s.continueRate; spinPer250.value = s.spinPer250;
  breakPayout.value = s.breakPayout ?? breakPayout.value;
  failPayout.value = s.failPayout ?? failPayout.value;
  payout1.value = s.p1; ratio1.value = s.r1;
  payout2.value = s.p2; ratio2.value = s.r2;
  payout3.value = s.p3; ratio3.value = s.r3;
  payout4.value = s.p4; ratio4.value = s.r4;
  enablePayout2.checked = s.e2; enablePayout3.checked = s.e3; enablePayout4.checked = s.e4;
  ltEnabled.checked = s.lt; ltRate.value = s.ltRate; ltContinueRate.value = s.ltCont;
  ltPayout1.value = s.lp1; ltRatio1.value = s.lr1;
  ltPayout2.value = s.lp2; ltRatio2.value = s.lr2;
  enableLtPayout1.checked = s.le1; enableLtPayout2.checked = s.le2;
  syncSettingSliders();
  updateRatioTotal();
  saveSettings();
}

// ========================
// ボタンイベント
// ========================
startBtn.addEventListener("click", simulate);
retryBtn.addEventListener("click", handleRetry);
backBtn.addEventListener("click", () => {
  spinning = false;
  playScreen.style.display    = "none";
  settingScreen.style.display = "block";
});

function handleRetry() {
  if (spinning) return;
  retryCount++;
  sessionStorage.setItem("ichigekiSimRetryCount", String(retryCount));
  if (retryCount % 5 === 0) {
    showRetryAd();
    return;
  }
  simulate();
}

function showRetryAd() {
  let seconds = 3;
  simAdNextBtn.disabled = true;
  simAdNextBtn.textContent = `もう一回を開始（${seconds}）`;
  simAdOverlay.classList.add("show");

  const timer = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      simAdNextBtn.textContent = `もう一回を開始（${seconds}）`;
      return;
    }
    clearInterval(timer);
    simAdNextBtn.disabled = false;
    simAdNextBtn.textContent = "もう一回を開始";
  }, 1000);

  simAdNextBtn.onclick = () => {
    clearInterval(timer);
    simAdOverlay.classList.remove("show");
    simulate();
  };
}

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
  retryBtn.style.display = "none";
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
  const payoutState = { spins, totalPayout, chainCount, costPerSpin };

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
      payoutState.spins = spins;
      applyPayout(
        breakthrough ? Number(breakPayout.value) : Number(failPayout.value),
        breakthrough ? "突破当たり" : "通常当たり",
        payoutState
      );
      totalPayout = payoutState.totalPayout;
      chainCount = payoutState.chainCount;

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

        payoutState.spins = spins;
        applyPayout(payout, "RUSH", payoutState);
        totalPayout = payoutState.totalPayout;
        chainCount = payoutState.chainCount;

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
  retryBtn.style.display = "block";
}

// ========================
// 初期化
// ========================
loadSettings();
updateRatioTotal();
