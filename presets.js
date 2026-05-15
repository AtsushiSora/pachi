// ========================
// プリセットデータ
// ========================
const STANDARD_319 = {
  hitRate: 319,
  breakRate: 60,
  continueRate: 81,
  spinPer250: 17,
  breakPayout: 1500,
  failPayout: 300,
  rounds: [
    { label: '10R', payout: 1500, ratio: 100 },
  ],
  p1: 1500, r1: 100, p2: 1500, r2: 0, p3: 1500, r3: 0, p4: 1500, r4: 0,
  e2: false, e3: false, e4: false,
  lt: false, ltRate: 20, ltCont: 90,
  lp1: 3000, lr1: 80, lp2: 6000, lr2: 20, le1: true, le2: true,
};

const HIGH_CONTINUE = {
  hitRate: 319,
  breakRate: 70,
  continueRate: 90,
  spinPer250: 17,
  breakPayout: 300,
  failPayout: 200,
  rounds: [
    { label: '3R',  payout: 450,  ratio: 55 },
    { label: '10R', payout: 1000, ratio: 35 },
    { label: '2R',  payout: 300,  ratio: 10 },
  ],
  p1: 450, r1: 55, p2: 1000, r2: 35, p3: 300, r3: 10, p4: 1000, r4: 0,
  e2: true, e3: true, e4: false,
  lt: false, ltRate: 20, ltCont: 95,
  lp1: 2000, lr1: 80, lp2: 3000, lr2: 20, le1: true, le2: true,
};

const LT_BURST = {
  hitRate: 399,
  breakRate: 50,
  continueRate: 88,
  spinPer250: 16,
  breakPayout: 300,
  failPayout: 200,
  rounds: [
    { label: '10R', payout: 1500, ratio: 50 },
    { label: '20R', payout: 3000, ratio: 35 },
    { label: '40R', payout: 6000, ratio: 15 },
  ],
  p1: 1500, r1: 50, p2: 3000, r2: 35, p3: 6000, r3: 15, p4: 6000, r4: 0,
  e2: true, e3: true, e4: false,
  lt: true, ltRate: 30, ltCont: 95,
  lp1: 3000, lr1: 65, lp2: 6000, lr2: 35, le1: true, le2: true,
};

const LIGHT = {
  hitRate: 99,
  breakRate: 55,
  continueRate: 70,
  spinPer250: 20,
  breakPayout: 300,
  failPayout: 100,
  rounds: [
    { label: '4R',  payout: 400,  ratio: 65 },
    { label: '10R', payout: 1000, ratio: 25 },
    { label: '2R',  payout: 200,  ratio: 10 },
  ],
  p1: 400, r1: 65, p2: 1000, r2: 25, p3: 200, r3: 10, p4: 1000, r4: 0,
  e2: true, e3: true, e4: false,
  lt: false, ltRate: 20, ltCont: 85,
  lp1: 1000, lr1: 80, lp2: 1500, lr2: 20, le1: true, le2: true,
};

const STABLE_MIDDLE = {
  hitRate: 249,
  breakRate: 65,
  continueRate: 75,
  spinPer250: 18,
  breakPayout: 600,
  failPayout: 300,
  rounds: [
    { label: '5R',  payout: 600,  ratio: 50 },
    { label: '10R', payout: 1200, ratio: 35 },
    { label: '3R',  payout: 400,  ratio: 15 },
  ],
  p1: 600, r1: 50, p2: 1200, r2: 35, p3: 400, r3: 15, p4: 1200, r4: 0,
  e2: true, e3: true, e4: false,
  lt: false, ltRate: 20, ltCont: 90,
  lp1: 1500, lr1: 80, lp2: 3000, lr2: 20, le1: true, le2: true,
};

const ONE_SHOT = {
  hitRate: 319,
  breakRate: 55,
  continueRate: 77,
  spinPer250: 16,
  breakPayout: 1500,
  failPayout: 300,
  rounds: [
    { label: '10R', payout: 1500, ratio: 75 },
    { label: '20R', payout: 3000, ratio: 20 },
    { label: '40R', payout: 6000, ratio: 5 },
  ],
  p1: 1500, r1: 75, p2: 3000, r2: 20, p3: 6000, r3: 5, p4: 6000, r4: 0,
  e2: true, e3: true, e4: false,
  lt: true, ltRate: 35, ltCont: 90,
  lp1: 3000, lr1: 70, lp2: 6000, lr2: 30, le1: true, le2: true,
};

const PRESETS = {
  standard319: STANDARD_319,
  highContinue: HIGH_CONTINUE,
  ltBurst: LT_BURST,
  light: LIGHT,
  stableMiddle: STABLE_MIDDLE,
  oneShot: ONE_SHOT,

  // 旧画面との互換用
  eva: STANDARD_319,
  rezero: ONE_SHOT,
  arami: LT_BURST,
  ama: LIGHT,
  umi: STABLE_MIDDLE,
  karakuri: ONE_SHOT,
  boukyou: HIGH_CONTINUE,
  madoka: HIGH_CONTINUE,
};
