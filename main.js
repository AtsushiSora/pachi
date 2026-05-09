// =====================
// 状態
// =====================

let spinning = false;

const logs = [];

// =====================
// 画面
// =====================

const settingScreen =
  document.getElementById(
    "settingScreen"
  );

const playScreen =
  document.getElementById(
    "playScreen"
  );

// =====================
// 表示
// =====================

const spinDisplay =
  document.getElementById(
    "spinDisplay"
  );

const chain =
  document.getElementById(
    "chain"
  );

const used =
  document.getElementById(
    "used"
  );

const total =
  document.getElementById(
    "total"
  );

const balance =
  document.getElementById(
    "balance"
  );

const log =
  document.getElementById(
    "log"
  );

const payoutEffect =
  document.getElementById(
    "payout-effect"
  );

// =====================
// 音
// =====================

const hitSound =
  document.getElementById(
    "hitSound"
  );

const rushSound =
  document.getElementById(
    "rushSound"
  );

// =====================
// 割合表示
// =====================

const ratioTotal =
  document.getElementById(
    "ratioTotal"
  );

const ratioRemain =
  document.getElementById(
    "ratioRemain"
  );

const ltRatioTotal =
  document.getElementById(
    "ltRatioTotal"
  );

const ltRatioRemain =
  document.getElementById(
    "ltRatioRemain"
  );

// =====================
// ±ボタン
// =====================

document
  .querySelectorAll(
    ".plus, .minus"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        changeValue(button);

      }
    );

  });

// =====================
// 数値変更
// =====================

function changeValue(button) {

  const target =
    document.getElementById(
      button.dataset.target
    );

  let value =
    Number(target.value);

  value += Number(
    button.dataset.change
  );

  if (value < 0) {

    value = 0;

  }

  // =====================
  // 通常割合制限
  // =====================

  if (
    target.id === "ratio1" ||
    target.id === "ratio2" ||
    target.id === "ratio3" ||
    target.id === "ratio4"
  ) {

    const totalWithoutCurrent =

      (target.id !== "ratio1"
        ? Number(ratio1.value)
        : 0)

      +

      (enablePayout2.checked &&
      target.id !== "ratio2"
        ? Number(ratio2.value)
        : 0)

      +

      (enablePayout3.checked &&
      target.id !== "ratio3"
        ? Number(ratio3.value)
        : 0)

      +

      (enablePayout4.checked &&
      target.id !== "ratio4"
        ? Number(ratio4.value)
        : 0);

    if (
      value +
      totalWithoutCurrent >
      100
    ) {

      value =
        100 -
        totalWithoutCurrent;

    }

  }

  // =====================
  // LT割合制限
  // =====================

  if (
    target.id === "ltRatio1" ||
    target.id === "ltRatio2"
  ) {

    const totalWithoutCurrent =

      (enableLtPayout1.checked &&
      target.id !== "ltRatio1"
        ? Number(
            ltRatio1.value
          )
        : 0)

      +

      (enableLtPayout2.checked &&
      target.id !== "ltRatio2"
        ? Number(
            ltRatio2.value
          )
        : 0);

    if (
      value +
      totalWithoutCurrent >
      100
    ) {

      value =
        100 -
        totalWithoutCurrent;

    }

  }

  target.value = value;

  updateRatioTotal();

  saveSettings();

}

// =====================
// 割合更新
// =====================

function updateRatioTotal() {

  // 通常

  const normalTotal =

    Number(ratio1.value)

    +

    (enablePayout2.checked
      ? Number(ratio2.value)
      : 0)

    +

    (enablePayout3.checked
      ? Number(ratio3.value)
      : 0)

    +

    (enablePayout4.checked
      ? Number(ratio4.value)
      : 0);

  ratioTotal.textContent =

    `通常合計：${normalTotal}%`;

  ratioRemain.textContent =

    `残り：${100 - normalTotal}%`;

  ratioTotal.className =

    normalTotal === 100
      ? "just"
      : "over";

  ratioRemain.className =

    normalTotal === 100
      ? "zero"
      : "";

  // LT

  const ltTotal =

    (enableLtPayout1.checked
      ? Number(
          ltRatio1.value
        )
      : 0)

    +

    (enableLtPayout2.checked
      ? Number(
          ltRatio2.value
        )
      : 0);

  ltRatioTotal.textContent =

    `LT合計：${ltTotal}%`;

  ltRatioRemain.textContent =

    `残り：${100 - ltTotal}%`;

  ltRatioTotal.className =

    ltTotal === 100
      ? "just"
      : "over";

  ltRatioRemain.className =

    ltTotal === 100
      ? "zero"
      : "";

}

// =====================
// 保存
// =====================

function saveSettings() {

  document
    .querySelectorAll("input")
    .forEach(input => {

      if (
        input.type ===
        "checkbox"
      ) {

        localStorage.setItem(
          input.id,
          input.checked
        );

      } else {

        localStorage.setItem(
          input.id,
          input.value
        );

      }

    });

}

// =====================
// 読み込み
// =====================

function loadSettings() {

  document
    .querySelectorAll("input")
    .forEach(input => {

      const saved =
        localStorage.getItem(
          input.id
        );

      if (saved !== null) {

        if (
          input.type ===
          "checkbox"
        ) {

          input.checked =
            saved === "true";

        } else {

          input.value = saved;

        }

      }

    });

}

// =====================
// ログ
// =====================

function addLog(text) {

  logs.push(text);

  if (logs.length > 50) {

    logs.shift();

  }

  log.innerHTML =
    logs.join("<br>");

}

// =====================
// ランダム
// =====================

function randomRange(min, max) {

  return Math.floor(

    Math.random() *

    (max - min + 1)

  ) + min;

}

// =====================
// 演出
// =====================

function showPayoutEffect(
  amount
) {

  payoutEffect.textContent =

    `+${amount}発`;

  payoutEffect.classList.add(
    "show"
  );

  document.body.classList.add(
    "flash"
  );

  setTimeout(() => {

    payoutEffect.classList.remove(
      "show"
    );

    document.body.classList.remove(
      "flash"
    );

  }, 600);

}

// =====================
// sleep
// =====================

function sleep(ms) {

  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });

}

// =====================
// プリセット
// =====================

function setPreset(type) {

  // =====================
  // エヴァ風
  // =====================

  if (type === "eva") {

    hitRate.value = 319;

    breakRate.value = 70;

    continueRate.value = 81;

    payout1.value = 1500;
    ratio1.value = 50;

    payout2.value = 3000;
    ratio2.value = 30;

    payout3.value = 4500;
    ratio3.value = 15;

    payout4.value = 6000;
    ratio4.value = 5;

    enablePayout2.checked =
      true;

    enablePayout3.checked =
      true;

    enablePayout4.checked =
      true;

    ltEnabled.checked = true;

    ltRate.value = 20;

    ltContinueRate.value =
      95;

    ltPayout1.value = 3000;
    ltRatio1.value = 80;

    ltPayout2.value = 4500;
    ltRatio2.value = 20;

  }

  // =====================
  // リゼロ風
  // =====================

  if (type === "rezero") {

    hitRate.value = 349;

    breakRate.value = 55;

    continueRate.value = 77;

    payout1.value = 1500;
    ratio1.value = 100;

    enablePayout2.checked =
      false;

    enablePayout3.checked =
      false;

    enablePayout4.checked =
      false;

    ltEnabled.checked = true;

    ltRate.value = 35;

    ltContinueRate.value =
      92;

    ltPayout1.value = 3000;
    ltRatio1.value = 90;

    ltPayout2.value = 6000;
    ltRatio2.value = 10;

  }

  // =====================
  // 荒波LT
  // =====================

  if (type === "arami") {

    hitRate.value = 399;

    breakRate.value = 50;

    continueRate.value = 76;

    payout1.value = 1500;
    ratio1.value = 70;

    payout2.value = 3000;
    ratio2.value = 20;

    payout3.value = 6000;
    ratio3.value = 10;

    enablePayout2.checked =
      true;

    enablePayout3.checked =
      true;

    enablePayout4.checked =
      false;

    ltEnabled.checked = true;

    ltRate.value = 40;

    ltContinueRate.value =
      96;

    ltPayout1.value = 3000;
    ltRatio1.value = 70;

    ltPayout2.value = 6000;
    ltRatio2.value = 30;

  }

  // =====================
  // 甘デジ
  // =====================

  if (type === "ama") {

    hitRate.value = 99;

    breakRate.value = 100;

    continueRate.value = 70;

    payout1.value = 500;
    ratio1.value = 70;

    payout2.value = 1500;
    ratio2.value = 30;

    enablePayout2.checked =
      true;

    enablePayout3.checked =
      false;

    enablePayout4.checked =
      false;

    ltEnabled.checked = false;

  }

  // =====================
  // 海風
  // =====================

  if (type === "umi") {

    hitRate.value = 319;

    breakRate.value = 100;

    continueRate.value = 65;

    payout1.value = 1500;
    ratio1.value = 100;

    enablePayout2.checked =
      false;

    enablePayout3.checked =
      false;

    enablePayout4.checked =
      false;

    ltEnabled.checked = false;

  }

  // =====================
  // からくり風
  // =====================

  if (type === "karakuri") {

    hitRate.value = 399;

    breakRate.value = 51;

    continueRate.value = 80;

    payout1.value = 1500;
    ratio1.value = 50;

    payout2.value = 3000;
    ratio2.value = 30;

    payout3.value = 4500;
    ratio3.value = 15;

    payout4.value = 9000;
    ratio4.value = 5;

    enablePayout2.checked =
      true;

    enablePayout3.checked =
      true;

    enablePayout4.checked =
      true;

    ltEnabled.checked = true;

    ltRate.value = 35;

    ltContinueRate.value =
      95;

    ltPayout1.value = 4500;

    ltRatio1.value = 70;

    ltPayout2.value = 9000;

    ltRatio2.value = 30;

  }

  // =====================
  // 暴凶星風
  // =====================

  if (type === "boukyou") {

    hitRate.value = 319;

    breakRate.value = 60;

    continueRate.value = 75;

    payout1.value = 3000;
    ratio1.value = 100;

    enablePayout2.checked =
      false;

    enablePayout3.checked =
      false;

    enablePayout4.checked =
      false;

    ltEnabled.checked = false;

  }

  // =====================
  // まどマギ風
  // =====================

  if (type === "madoka") {

    hitRate.value = 199;

    breakRate.value = 75;

    continueRate.value = 82;

    payout1.value = 1500;
    ratio1.value = 60;

    payout2.value = 3000;
    ratio2.value = 30;

    payout3.value = 4500;
    ratio3.value = 10;

    enablePayout2.checked =
      true;

    enablePayout3.checked =
      true;

    enablePayout4.checked =
      false;

    ltEnabled.checked = true;

    ltRate.value = 20;

    ltContinueRate.value =
      92;

    ltPayout1.value = 3000;

    ltRatio1.value = 80;

    ltPayout2.value = 6000;

    ltRatio2.value = 20;

  }

  updateRatioTotal();

  saveSettings();

}

// =====================
// START
// =====================

startBtn.addEventListener(
  "click",
  simulate
);

// =====================
// RETRY
// =====================

retryBtn.addEventListener(
  "click",
  () => {

    simulate();

  }
);

// =====================
// 戻る
// =====================

backBtn.addEventListener(
  "click",
  () => {

    spinning = false;

    playScreen.style.display =
      "none";

    settingScreen.style.display =
      "block";

  }
);

// =====================
// シミュレーション
// =====================

async function simulate() {

  if (spinning) return;

  spinning = true;

  // =====================
  // 完全リセット
  // =====================

  spinDisplay.textContent =
    "回転開始";

  used.textContent =
    "使用玉: 0発";

  total.textContent =
    "総出玉: 0発";

  balance.textContent =
    "差玉: 0発";

  log.innerHTML = "";

  logs.length = 0;

  payoutEffect.textContent = "";

  document.body.classList.remove(
    "super-hit"
  );

  document.body.classList.remove(
    "flash"
  );

  // =====================

  retryBtn.style.display =
    "none";

  settingScreen.style.display =
    "none";

  playScreen.style.display =
    "block";

  let spins = 0;

  let totalPayout = 0;

  let chainCount = 0;

  const spinPer250Value =

    Number(
      spinPer250.value
    );

  const costPerSpin =

    250 /
    spinPer250Value;

  // =====================
  // 通常
  // =====================

  while (spinning) {

    spins++;

    spinDisplay.textContent =

      `${spins}回転`;

    // ハマり

    if (spins >= 1000) {

      spinDisplay.classList.add(
        "warning"
      );

    }

    const hit =

      Math.random() <

      (
        1 /
        Number(hitRate.value)
      );

    if (hit) {

      spinDisplay.classList.remove(
        "warning"
      );

      hitSound.currentTime = 0;

      hitSound.play();

      addLog(
        `${spins}回転で当たり！`
      );

      // 突破

      const breakthrough =

        Math.random() <

        (
          Number(
            breakRate.value
          ) / 100
        );

      if (!breakthrough) {

        addLog(
          "突破失敗..."
        );

        break;

      }

      rushSound.currentTime = 0;

      rushSound.play();

      addLog(
        "RUSH突入！"
      );

      // LT

      let isLT = false;

      if (
        ltEnabled.checked
      ) {

        const ltHit =

          Math.random() <

          (
            Number(
              ltRate.value
            ) / 100
          );

        if (ltHit) {

          isLT = true;

          addLog(
            `
            <div class="lt">
              LT突入！！
            </div>
            `
          );

        }

      }

      // =====================
      // RUSH
      // =====================

      let rush = true;

      while (
        rush &&
        spinning
      ) {

        const rand =
          Math.random() * 100;

        let payout = 0;

        const payouts = [

          {
            enabled: true,

            payout:
              Number(
                payout1.value
              ),

            ratio:
              Number(
                ratio1.value
              )
          },

          {
            enabled:
              enablePayout2.checked,

            payout:
              Number(
                payout2.value
              ),

            ratio:
              Number(
                ratio2.value
              )
          },

          {
            enabled:
              enablePayout3.checked,

            payout:
              Number(
                payout3.value
              ),

            ratio:
              Number(
                ratio3.value
              )
          },

          {
            enabled:
              enablePayout4.checked,

            payout:
              Number(
                payout4.value
              ),

            ratio:
              Number(
                ratio4.value
              )
          }

        ];

        const ltPayouts = [

          {
            enabled:
              enableLtPayout1.checked,

            payout:
              Number(
                ltPayout1.value
              ),

            ratio:
              Number(
                ltRatio1.value
              )
          },

          {
            enabled:
              enableLtPayout2.checked,

            payout:
              Number(
                ltPayout2.value
              ),

            ratio:
              Number(
                ltRatio2.value
              )
          }

        ];

        const targetArray =

          isLT
            ? ltPayouts
            : payouts;

        let cumulative = 0;

        for (
          const item
          of targetArray
        ) {

          if (
            !item.enabled
          ) continue;

          cumulative +=
            item.ratio;

          if (
            rand <
            cumulative
          ) {

            payout =
              randomRange(

                item.payout - 100,

                item.payout + 100

              );

            break;

          }

        }

        chainCount++;

chain.textContent =
  `連チャン: ${chainCount}回`;

        totalPayout += payout;

        total.textContent =

          `総出玉: ${totalPayout}発`;

        showPayoutEffect(
          payout
        );

        addLog(
          `${payout}発獲得！`
        );

        // 爆連

        if (payout >= 5000) {

          document.body.classList.add(
            "super-hit"
          );

          setTimeout(() => {

            document.body.classList.remove(
              "super-hit"
            );

          }, 1500);

        }

        await sleep(700);

        // 継続

        const currentRate =

          isLT

            ? Number(
                ltContinueRate.value
              )

            : Number(
                continueRate.value
              );

        const cont =

          Math.random() <

          (
            currentRate / 100
          );

        if (!cont) {

          rush = false;

          addLog(
            "RUSH終了"
          );

        }

      }

      break;

    }

    // ハマりログ

    if (
      spins % 300 === 0
    ) {

      addLog(
        `${spins}回転ハマり中...`
      );

    }

    await sleep(1);

  }

  spinning = false;

  // =====================
  // 使用玉
  // =====================

  const usedBalls =

    Math.floor(
      spins *
      costPerSpin
    );

  const diff =

    totalPayout -
    usedBalls;

  used.textContent =

    `使用玉: ${usedBalls}発`;

  balance.textContent =

    `差玉: ${diff}発`;

  retryBtn.style.display =
    "block";

}

// =====================
// 初期化
// =====================

loadSettings();

updateRatioTotal();