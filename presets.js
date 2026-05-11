// ========================
// プリセットデータ
// 新しい台を追加するときはここに足すだけ
// ========================
const PRESETS = {

  eva: {
    hitRate:319, breakRate:70, continueRate:81, spinPer250:17,
    p1:1500, r1:50,  p2:3000, r2:30,  p3:4500, r3:15,  p4:6000, r4:5,
    e2:true,  e3:true,  e4:true,
    lt:true,  ltRate:20, ltCont:95,
    lp1:3000, lr1:80, lp2:4500, lr2:20, le1:true, le2:true,
  },

  rezero: {
    hitRate:349, breakRate:55, continueRate:77, spinPer250:17,
    p1:1500, r1:100, p2:3000, r2:0,  p3:4500, r3:0,  p4:6000, r4:0,
    e2:false, e3:false, e4:false,
    lt:true,  ltRate:35, ltCont:92,
    lp1:3000, lr1:90, lp2:6000, lr2:10, le1:true, le2:true,
  },

  arami: {
    hitRate:399, breakRate:50, continueRate:76, spinPer250:17,
    p1:1500, r1:70,  p2:3000, r2:20,  p3:6000, r3:10,  p4:6000, r4:0,
    e2:true,  e3:true,  e4:false,
    lt:true,  ltRate:30, ltCont:88,
    lp1:3000, lr1:70, lp2:6000, lr2:30, le1:true, le2:true,
  },

  ama: {
    hitRate:99,  breakRate:65, continueRate:70, spinPer250:20,
    p1:1000, r1:100, p2:3000, r2:0,  p3:4500, r3:0,  p4:6000, r4:0,
    e2:false, e3:false, e4:false,
    lt:false, ltRate:20, ltCont:95,
    lp1:3000, lr1:80, lp2:4500, lr2:20, le1:true, le2:true,
  },

  umi: {
    hitRate:249, breakRate:60, continueRate:73, spinPer250:17,
    p1:1500, r1:80,  p2:3000, r2:20,  p3:4500, r3:0,  p4:6000, r4:0,
    e2:true,  e3:false, e4:false,
    lt:false, ltRate:20, ltCont:95,
    lp1:3000, lr1:80, lp2:4500, lr2:20, le1:true, le2:true,
  },

  karakuri: {
    hitRate:319, breakRate:65, continueRate:80, spinPer250:17,
    p1:2000, r1:60,  p2:4000, r2:30,  p3:6000, r3:10,  p4:6000, r4:0,
    e2:true,  e3:true,  e4:false,
    lt:true,  ltRate:35, ltCont:95,
    lp1:4500, lr1:70, lp2:9000, lr2:30, le1:true, le2:true,
  },

  boukyou: {
    hitRate:319, breakRate:60, continueRate:75, spinPer250:17,
    p1:3000, r1:100, p2:3000, r2:0,  p3:4500, r3:0,  p4:6000, r4:0,
    e2:false, e3:false, e4:false,
    lt:false, ltRate:20, ltCont:95,
    lp1:3000, lr1:80, lp2:4500, lr2:20, le1:true, le2:true,
  },

  madoka: {
    hitRate:199, breakRate:75, continueRate:82, spinPer250:17,
    p1:1500, r1:60,  p2:3000, r2:30,  p3:4500, r3:10,  p4:6000, r4:0,
    e2:true,  e3:true,  e4:false,
    lt:true,  ltRate:20, ltCont:92,
    lp1:3000, lr1:80, lp2:6000, lr2:20, le1:true, le2:true,
  },

};
