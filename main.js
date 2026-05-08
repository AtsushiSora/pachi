const startBtn =
  document.getElementById(
    "startBtn"
  );

const retryBtn =
  document.getElementById(
    "retryBtn"
  );

const backBtn =
  document.getElementById(
    "backBtn"
  );

const settingScreen =
  document.getElementById(
    "settingScreen"
  );

const playScreen =
  document.getElementById(
    "playScreen"
  );

const spinDisplay =
  document.getElementById(
    "spinDisplay"
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

const hitCountDisplay =
  document.getElementById(
    "hitCount"
  );

const maxChainDisplay =
  document.getElementById(
    "maxChain"
  );

const currentChainDisplay =
  document.getElementById(
    "currentChain"
  );

const hitSound =
  document.getElementById(
    "hitSound"
  );

const rushSound =
  document.getElementById(
    "rushSound"
  );

/* ===================== */
/* 長押し対応 */
/* ===================== */

let holdInterval = null;

document
  .querySelectorAll(
    ".plus, .minus"
  )
  .forEach(button => {

    const changeValue = () => {

      const target =
        document.getElementById(
          button.dataset.target
        );

      const change =
        Number(
          button.dataset.change
        );

      let value =
        Number(target.value);

      value += change;

      if (value < 0) {
        value = 0;
      }

      target.value = value;

      updateRatio();
    };

    button.addEventListener(
      "click",
      changeValue
    );

    button.addEventListener(
      "mousedown",
      () => {

        holdInterval =
          setInterval(
            changeValue,
            80
          );

      }
    );

    button.addEventListener(
      "mouseup",
      () => {

        clearInterval(
          holdInterval
        );

      }
    );

    button.addEventListener(
      "mouseleave",
      () => {

        clearInterval(
          holdInterval
        );

      }
    );

    button.addEventListener(
      "touchstart",
      () => {

        holdInterval =
          setInterval(
            changeValue,
            80
          );

      }
    );

    button.addEventListener(
      "touchend",
      () => {

        clearInterval(
          holdInterval
        );

      }
    );

  });

/* ===================== */
/* 割合制限 */
/* ===================== */

const ratioInputs = [

  document.getElementById(
    "ratio1"
  ),

  document.getElementById(
    "ratio2"
  ),

  document.getElementById(
    "ratio3"
  ),

  document.getElementById(
    "ratio4"
  )

];

function updateRatio() {

  let totalRatio = 0;

  ratioInputs.forEach(
    input => {

      totalRatio +=
        Number(input.value);

    }
  );

  if (totalRatio > 100) {

    alert(
      "割合は100%以下にしてください"
    );

    return;

  }

  document.getElementById(
    "ratioTotal"
  ).textContent =

    `通常合計：${totalRatio}%`;

  document.getElementById(
    "ratioRemain"
  ).textContent =

    `残り：${100-totalRatio}%`;

}

ratioInputs.forEach(
  input => {

    input.addEventListener(
      "input",
      updateRatio
    );

  }
);

updateRatio();

/* ===================== */
/* ログ軽量化 */
/* ===================== */

const logs = [];

function addLog(text) {

  logs.push(text);

  if (logs.length > 50) {

    logs.shift();

  }

  log.innerHTML =
    logs.join("<br>");

}

/* ===================== */
/* ランダム */
/* ===================== */

function randomRange(min,max) {

  return Math.floor(

    Math.random() *

    (max-min+1)

  ) + min;

}

/* ===================== */
/* 出玉振り分け */
/* ===================== */

function getRandomPayout() {

  const table = [

    {
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

  const rand =
    Math.random() * 100;

  let cumulative = 0;

  for (const item of table) {

    cumulative +=
      item.ratio;

    if (rand <= cumulative) {

      return randomRange(
        item.payout - 100,
        item.payout + 100
      );

    }

  }

  return 0;

}

/* ===================== */
/* 演出 */
/* ===================== */

function showPayoutEffect(amount) {

  payoutEffect.textContent =

    `+${amount}発`;

  payoutEffect.style.opacity = 1;

  document.body.classList.add(
    "flash"
  );

  setTimeout(() => {

    document.body.classList.remove(
      "flash"
    );

  },300);

  setTimeout(() => {

    payoutEffect.style.opacity = 0;

  },1000);

}

/* ===================== */
/* グラフ */
/* ===================== */

function updateChart(data) {

  const canvas =
    document.getElementById(
      "historyChart"
    );

  const ctx =
    canvas.getContext("2d");

  canvas.width =
    canvas.offsetWidth;

  canvas.height = 300;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  if (data.length < 2)
    return;

  const max =
    Math.max(...data);

  const min =
    Math.min(...data);

  ctx.beginPath();

  data.forEach(
    (value,index) => {

      const x =

        (
          canvas.width /
          (data.length - 1)
        ) * index;

      const y =

        canvas.height -

        (
          (
            value - min
          ) /

          (
            max - min || 1
          )
        ) *

        canvas.height;

      if (index === 0) {

        ctx.moveTo(x,y);

      } else {

        ctx.lineTo(x,y);

      }

    }
  );

  ctx.lineWidth = 4;

  ctx.strokeStyle =
    "#00ff66";

  ctx.stroke();

}

/* ===================== */
/* シミュレーション */
/* ===================== */

let spinning = false;

async function simulate() {

  if (spinning) return;

  spinning = true;

  logs.length = 0;

  log.innerHTML = "";

  playScreen.scrollTo(
    0,
    0
  );

  settingScreen.style.display =
    "none";

  playScreen.style.display =
    "block";

  retryBtn.style.display =
    "none";

  let spins = 0;

  let usedBalls = 0;

  let totalPayout = 0;

  let hitCount = 0;

  let currentChain = 0;

  let maxChain = 0;

  const history = [];

  while (true) {

    spins++;

    spinDisplay.textContent =
      `${spins}回転`;

    const hit =

      Math.random() <

      (
        1 /
        Number(hitRate.value)
      );

    if (hit) {

      hitCount++;

      hitCountDisplay.textContent =
        hitCount;

      hitSound.currentTime = 0;

      hitSound.play();

      addLog(
        `${spins}回転で当たり！`
      );

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

      let rush = true;

      while (rush) {

        currentChain++;

        if (
          currentChain >
          maxChain
        ) {

          maxChain =
            currentChain;

        }

        currentChainDisplay.textContent =
          currentChain;

        maxChainDisplay.textContent =
          maxChain;

        const payout =
          getRandomPayout();

        totalPayout += payout;

        total.textContent =

          `総出玉: ${totalPayout}発`;

        showPayoutEffect(
          payout
        );

        addLog(
          `${payout}発獲得！`
        );

        history.push(
          totalPayout
        );

        updateChart(
          history
        );

        if (payout >= 5000) {

          document.body.classList.add(
            "super-hit"
          );

          setTimeout(() => {

            document.body.classList.remove(
              "super-hit"
            );

          },1500);

        }

        const cont =

          Math.random() <

          (
            Number(
              continueRate.value
            ) / 100
          );

        if (!cont) {

          rush = false;

          addLog(
            "RUSH終了"
          );

        }

        await new Promise(
          resolve =>

            setTimeout(
              resolve,
              300
            )
        );

      }

      break;

    }

    await new Promise(
      resolve =>

        setTimeout(
          resolve,
          1
        )
    );

  }

  usedBalls = Math.floor(

    spins *

    (
      250 /
      Number(
        spinPer250.value
      )
    )

  );

  const diff =
    totalPayout - usedBalls;

  used.textContent =

    `使用玉: ${usedBalls}発`;

  balance.textContent =

    `差玉: ${diff}発`;

  retryBtn.style.display =
    "block";

  spinning = false;

}

/* ===================== */
/* ボタン */
/* ===================== */

startBtn.addEventListener(
  "click",
  simulate
);

retryBtn.addEventListener(
  "click",
  simulate
);

backBtn.addEventListener(
  "click",
  () => {

    playScreen.style.display =
      "none";

    settingScreen.style.display =
      "block";

  }
);