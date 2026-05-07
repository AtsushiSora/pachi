let interval;
let spinning = false;

// ====================
// ボタン長押し
// ====================

const buttons =
  document.querySelectorAll(
    ".plus, .minus"
  );

buttons.forEach(button => {

  button.addEventListener(
    "mousedown",
    startChanging
  );

  button.addEventListener(
    "mouseup",
    stopChanging
  );

  button.addEventListener(
    "mouseleave",
    stopChanging
  );

  button.addEventListener(
    "touchstart",
    startChanging
  );

  button.addEventListener(
    "touchend",
    stopChanging
  );

});

function startChanging(e) {

  const button = e.target;

  const target =
    button.dataset.target;

  const change =
    Number(button.dataset.change);

  changeValue(target, change);

  interval = setInterval(() => {

    changeValue(target, change);

  }, 80);

}

function stopChanging() {

  clearInterval(interval);

}

function changeValue(id, amount) {

  const input =
    document.getElementById(id);

  let value =
    Number(input.value);

  value += amount;

  if (value < 0) {

    value = 0;

  }

  input.value = value;

}

// ====================
// 要素取得
// ====================

const startBtn =
  document.getElementById(
    "startBtn"
  );

const stopBtn =
  document.getElementById(
    "stopBtn"
  );

const log =
  document.getElementById(
    "log"
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

const spinDisplay =
  document.getElementById(
    "spinDisplay"
  );

// ====================
// スタート
// ====================

startBtn.addEventListener(
  "click",
  simulate
);

// ====================
// 停止
// ====================

stopBtn.addEventListener(
  "click",
  () => {

    spinning = false;

  }
);

// ====================
// プリセット
// ====================

function setPreset(type) {

  // エヴァ風

  if (type === "eva") {

    hitRate.value = 319;

    breakRate.value = 70;

    continueRate.value = 81;

    payout1.value = 1500;
    ratio1.value = 50;

    payout2.value = 3000;
    ratio2.value = 10;

    payout3.value = 450;
    ratio3.value = 40;

    ltRate.value = 10;
    ltContinueRate.value = 90;

    ltPayout1.value = 3000;
    ltRatio1.value = 80;

    ltPayout2.value = 4500;
    ltRatio2.value = 20;

  }

  // リゼロ風

  if (type === "rezero") {

    hitRate.value = 349;

    breakRate.value = 55;

    continueRate.value = 77;

    payout1.value = 1500;
    ratio1.value = 100;

    payout2.value = 0;
    ratio2.value = 0;

    payout3.value = 0;
    ratio3.value = 0;

    ltRate.value = 20;
    ltContinueRate.value = 92;

    ltPayout1.value = 3000;
    ltRatio1.value = 100;

    ltPayout2.value = 0;
    ltRatio2.value = 0;

  }

  // 北斗風

  if (type === "hokuto") {

    hitRate.value = 319;

    breakRate.value = 60;

    continueRate.value = 84;

    payout1.value = 1500;
    ratio1.value = 70;

    payout2.value = 3000;
    ratio2.value = 20;

    payout3.value = 450;
    ratio3.value = 10;

    ltRate.value = 15;
    ltContinueRate.value = 92;

    ltPayout1.value = 3000;
    ltRatio1.value = 70;

    ltPayout2.value = 4500;
    ltRatio2.value = 30;

  }

  // からくり風

  if (type === "karakuri") {

    hitRate.value = 399;

    breakRate.value = 50;

    continueRate.value = 75;

    payout1.value = 1500;
    ratio1.value = 30;

    payout2.value = 3000;
    ratio2.value = 70;

    payout3.value = 0;
    ratio3.value = 0;

    ltRate.value = 40;
    ltContinueRate.value = 96;

    ltPayout1.value = 3000;
    ltRatio1.value = 80;

    ltPayout2.value = 6000;
    ltRatio2.value = 20;

  }

}

// ====================
// ランダム
// ====================

function randomRange(min, max) {

  return Math.floor(
    Math.random() *
    (max - min + 1)
  ) + min;

}

// ====================
// 演出
// ====================

function showPayoutEffect(amount) {

  const effect =
    document.getElementById(
      "payout-effect"
    );

  effect.textContent =
    `+${amount}発`;

  effect.classList.add("show");

  document.body.classList.add(
    "flash"
  );

  setTimeout(() => {

    effect.classList.remove(
      "show"
    );

    document.body.classList.remove(
      "flash"
    );

  }, 500);

}

// ====================
// sleep
// ====================

function sleep(ms) {

  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });

}

// ====================
// メイン処理
// ====================

async function simulate() {

  if (spinning) return;

  spinning = true;

  log.innerHTML = "";

  let spins = 0;

  let totalPayout = 0;

  const spinPer250 =
    Number(
      document.getElementById(
        "spinPer250"
      ).value
    );

  const costPerSpin =
    250 / spinPer250;

  // ====================
  // 通常時
  // ====================

  while (spinning) {

    spins++;

    spinDisplay.textContent =
      `${spins}回転`;

    // ハマり警告

    if (spins >= 1000) {

      spinDisplay.classList.add(
        "warning"
      );

    }

    // 当たり抽選

    const hit =
      Math.random() <
      (
        1 /
        Number(hitRate.value)
      );

    if (hit) {

      spinning = false;

      spinDisplay.classList.remove(
        "warning"
      );

      log.innerHTML +=
        `${spins}回転で当たり！<br>`;

      // ====================
      // 突破
      // ====================

      const breakthrough =
        Math.random() <
        (
          Number(
            breakRate.value
          ) / 100
        );

      if (!breakthrough) {

        log.innerHTML +=
          `突破失敗...<br>`;

        break;

      }

      log.innerHTML +=
        `RUSH突入！<br>`;

      // ====================
      // LT抽選
      // ====================

      let isLT = false;

      const ltEnabled =
        document.getElementById(
          "ltEnabled"
        ).checked;

      let ltHit = false;

      if (ltEnabled) {

        ltHit =
          Math.random() <
          (
            Number(
              ltRate.value
            ) / 100
          );

      }

      if (ltHit) {

        isLT = true;

        log.innerHTML +=
          `<div class="lt">
            LT突入！！
          </div>`;

      }

      // ====================
      // RUSH
      // ====================

      let rush = true;

      while (rush) {

        const rand =
          Math.random() * 100;

        let payout = 0;

        // LT用

        if (isLT) {

          const useRatio1 =
            Number(
              ltRatio1.value
            );

          const usePayout1 =
            Number(
              ltPayout1.value
            );

          const usePayout2 =
            Number(
              ltPayout2.value
            );

          if (rand < useRatio1) {

            payout =
              randomRange(
                usePayout1 - 200,
                usePayout1 + 200
              );

          } else {

            payout =
              randomRange(
                usePayout2 - 300,
                usePayout2 + 300
              );

          }

        }

        // 通常RUSH

        else {

          if (
            rand <
            Number(ratio1.value)
          ) {

            payout =
              randomRange(
                Number(
                  payout1.value
                ) - 100,

                Number(
                  payout1.value
                ) + 100
              );

          } else if (

            rand <

            Number(ratio1.value) +
            Number(ratio2.value)

          ) {

            payout =
              randomRange(

                Number(
                  payout2.value
                ) - 200,

                Number(
                  payout2.value
                ) + 200

              );

          } else {

            payout =
              randomRange(

                Number(
                  payout3.value
                ) - 50,

                Number(
                  payout3.value
                ) + 50

              );

          }

        }

        totalPayout += payout;

        total.textContent =
          `総出玉: ${totalPayout}発`;

        showPayoutEffect(
          payout
        );

        log.innerHTML +=
          `${payout}発獲得！<br>`;

        await sleep(700);

        // 継続抽選

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

          log.innerHTML +=
            `RUSH終了<br>`;

        }

      }

    }

    // ハマり演出

    if (
      spins % 300 === 0
    ) {

      log.innerHTML +=
        `${spins}回転ハマり中...<br>`;

    }

    await sleep(1);

  }

  // ====================
  // 使用玉
  // ====================

  const usedBalls =
    Math.floor(
      spins * costPerSpin
    );

  const diff =
    totalPayout - usedBalls;

  used.textContent =
    `使用玉: ${usedBalls}発`;

  balance.textContent =
    `差玉: ${diff}発`;

}