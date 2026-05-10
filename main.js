let currentSpec = specs.eva15;

let usedBalls = 0;
let renchan = 0;

const hitRateEl = document.getElementById("hitRate");
const rushRateEl = document.getElementById("rushRate");

const usedBallsEl = document.getElementById("usedBalls");
const renchanEl = document.getElementById("renchan");

const resultEl = document.getElementById("result");

const specSelect = document.getElementById("specSelect");

function loadSpec(key) {

  currentSpec = specs[key];

  hitRateEl.textContent =
    `1/${currentSpec.hitRate}`;

  rushRateEl.textContent =
    currentSpec.rushRate;

}

loadSpec("eva15");

specSelect.addEventListener("change", (e) => {

  loadSpec(e.target.value);

});

document.getElementById("startButton")
  .addEventListener("click", startGame);

function startGame() {

  usedBalls += 250;

  usedBallsEl.textContent = usedBalls;

  const random =
    Math.floor(Math.random() * currentSpec.hitRate);

  if (random === 0) {

    renchan++;

    renchanEl.textContent = renchan;

    resultEl.innerHTML =
      "🎉 大当たり！";

  } else {

    resultEl.innerHTML =
      "ハズレ";

  }

}