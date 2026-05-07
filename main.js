let interval;

const buttons = document.querySelectorAll(".plus, .minus");

buttons.forEach(button => {

  button.addEventListener("mousedown", startChanging);
  button.addEventListener("mouseup", stopChanging);
  button.addEventListener("mouseleave", stopChanging);

  button.addEventListener("touchstart", startChanging);
  button.addEventListener("touchend", stopChanging);

});

function startChanging(e) {

  const button = e.target;

  const target = button.dataset.target;
  const change = Number(button.dataset.change);

  changeValue(target, change);

  interval = setInterval(() => {
    changeValue(target, change);
  }, 80);

}

function stopChanging() {

  clearInterval(interval);

}

function changeValue(id, amount) {

  const input = document.getElementById(id);

  let value = Number(input.value);

  value += amount;

  if (value < 1) {
    value = 1;
  }

  input.value = value;

}

function setPreset(type) {

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

  }

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

  }

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

  }

}

const startBtn = document.getElementById("startBtn");
const log = document.getElementById("log");
const total = document.getElementById("total");

startBtn.addEventListener("click", simulate);

function simulate() {

  const hitRate =
    Number(document.getElementById("hitRate").value);

  const breakRate =
    Number(document.getElementById("breakRate").value);

  const continueRate =
    Number(document.getElementById("continueRate").value);

  const payout1 =
    Number(document.getElementById("payout1").value);

  const ratio1 =
    Number(document.getElementById("ratio1").value);

  const payout2 =
    Number(document.getElementById("payout2").value);

  const ratio2 =
    Number(document.getElementById("ratio2").value);

  const payout3 =
    Number(document.getElementById("payout3").value);

  const ratio3 =
    Number(document.getElementById("ratio3").value);

  let spins = 0;
  let totalPayout = 0;

  log.innerHTML = "";

  while (true) {

    spins++;

    const hit =
      Math.random() < (1 / hitRate);

    if (hit) {

      log.innerHTML +=
        `${spins}回転で当たり！<br>`;

      const breakthrough =
        Math.random() < (breakRate / 100);

      if (!breakthrough) {

        log.innerHTML +=
          `突破失敗... 通常終了<br>`;

        break;

      }

      log.innerHTML +=
        `RUSH突入！<br>`;

      let rush = true;

      while (rush) {

        const rand =
          Math.random() * 100;

        let payout = 0;

        if (rand < ratio1) {

          payout = payout1;

        } else if (
          rand < ratio1 + ratio2
        ) {

          payout = payout2;

        } else {

          payout = payout3;

        }

        totalPayout += payout;

        log.innerHTML +=
          `${payout}発獲得！<br>`;

        const cont =
          Math.random() <
          (continueRate / 100);

        if (!cont) {

          rush = false;

          log.innerHTML +=
            `RUSH終了<br>`;

        }

      }

      break;

    }

  }

  total.textContent =
    `総出玉: ${totalPayout}発`;

}