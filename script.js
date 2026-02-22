/**
 * 8-bit style: red-haired cook with green eyes, eggs in a pan.
 * Limited palette — dark purplish-blue room, earthy tones.
 */
(function () {
  const canvas = document.getElementById("scene");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const W = 320;
  const H = 288;

  // Minimal 8-bit palette (no outlines) (very dark room, brown strip at bottom)
  const COL = {
    room: "#252520",
    roomDark: "#1e1e1c",
    stove: "#2d241c",
    counter: "#3d3122",
    hair: "#c0392b",
    hairDark: "#922b21",
    skin: "#d4a574",
    skinShadow: "#b8956a",
    eye: "#27ae60",
    eyeSparkle: "#ffffff",
    apron: "#fcfcfc",
    apronShadow: "#e8e4e0",
    pan: "#1a1a1a",
    panShine: "#333333",
    eggYolk: "#f1c40f",
    eggWhite: "#ffffff",
    steam: "#e0e0e0",
    spatula: "#5d4e37",
    spatulaDark: "#3d3225",
  };

  let time = 0;
  let blinkTimer = 0;
  let blink = false;

  function rect(x, y, w, h, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
  }

  function drawBackground() {
    rect(0, 0, W, H, COL.room);
    rect(0, 0, W, H - 80, COL.roomDark);
    rect(0, H - 80, W, 40, COL.stove);
    rect(0, H - 40, W, 40, COL.counter);
  }

  function drawSteam() {
    const t = time * 0.06;
    for (let i = 0; i < 10; i++) {
      const x = 200 + Math.sin(t + i * 0.8) * 24 + (i % 4) * 6;
      const y = 220 - (t * 15 + i * 12) % 80;
      const a = Math.max(0, 0.7 - (220 - y) / 120);
      if (a > 0 && y > 180) {
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(x, y, 6, 6);
        ctx.fillRect(x + 6, y - 3, 6, 6);
      }
    }
  }

  function drawPan() {
    const py = 216;
    const px = 140;
    ctx.fillStyle = COL.pan;
    ctx.fillRect(px, py - 4, 120, 48);
    ctx.fillRect(px + 4, py, 112, 40);
    ctx.fillStyle = COL.panShine;
    ctx.fillRect(px + 8, py - 2, 40, 4);
    ctx.fillStyle = COL.pan;
    ctx.fillRect(px + 118, py + 12, 28, 12);
    ctx.fillRect(px + 144, py + 16, 8, 6);
  }

  function drawEggs(armFrame) {
    const py = 218;
    const px = 152;
    const stir = Math.sin(armFrame * 0.4) * 4;
    ctx.fillStyle = COL.eggWhite;
    ctx.fillRect(px + 12 + stir, py + 8, 44, 24);
    ctx.fillRect(px + 52 + stir * 0.5, py + 14, 36, 18);
    ctx.fillStyle = COL.eggYolk;
    ctx.fillRect(px + 20 + stir, py + 12, 24, 16);
    ctx.fillRect(px + 56, py + 18, 18, 12);
  }

  function drawWoman(armFrame, blinkOn, bounce) {
    const bx = 80;
    const by = 88 + bounce;

    // Hair (red) - blocky 8-bit style, no outline
    ctx.fillStyle = COL.hairDark;
    ctx.fillRect(bx + 6, by, 84, 110);
    ctx.fillStyle = COL.hair;
    ctx.fillRect(bx + 10, by + 4, 76, 98);
    ctx.fillRect(bx + 6, by + 8, 6, 88);
    ctx.fillRect(bx + 88, by + 8, 6, 88);
    ctx.fillRect(bx + 6, by + 72, 86, 42);

    // Face (skin)
    ctx.fillStyle = COL.skinShadow;
    ctx.fillRect(bx + 24, by + 22, 48, 36);
    ctx.fillStyle = COL.skin;
    ctx.fillRect(bx + 26, by + 22, 44, 34);
    ctx.fillRect(bx + 20, by + 26, 4, 26);
    ctx.fillRect(bx + 72, by + 26, 4, 26);

    // Eyes (green) - two distinct green pixels, or closed for blink
    if (blinkOn) {
      ctx.fillStyle = COL.eye;
      ctx.fillRect(bx + 30, by + 26, 10, 2);
      ctx.fillRect(bx + 60, by + 26, 10, 2);
    } else {
      ctx.fillStyle = COL.eye;
      ctx.fillRect(bx + 28, by + 26, 14, 10);
      ctx.fillRect(bx + 58, by + 26, 14, 10);
      ctx.fillStyle = COL.eyeSparkle;
      ctx.fillRect(bx + 34, by + 28, 4, 4);
      ctx.fillRect(bx + 64, by + 28, 4, 4);
    }

    // Body / apron (cream off-white)
    ctx.fillStyle = COL.apronShadow;
    ctx.fillRect(bx + 14, by + 60, 68, 68);
    ctx.fillStyle = COL.apron;
    ctx.fillRect(bx + 18, by + 62, 60, 62);
    ctx.fillRect(bx + 14, by + 66, 4, 54);
    ctx.fillRect(bx + 82, by + 66, 4, 54);
    ctx.fillRect(bx + 18, by + 118, 60, 4);

    // Arm with spatula (dark brown)
    const armSwing = Math.sin(armFrame) * 8;
    const armBob = Math.sin(armFrame * 1.2) * 4;
    const armY = by + 72 + armBob;
    const armX = bx + 78 + Math.sin(armFrame * 0.5) * 2;
    ctx.fillStyle = COL.skinShadow;
    ctx.fillRect(armX, armY, 48, 8);
    ctx.fillStyle = COL.skin;
    ctx.fillRect(armX + 2, armY, 44, 8);
    ctx.fillRect(armX + 44, armY - 2, 8, 10);
    ctx.fillStyle = COL.spatulaDark;
    ctx.fillRect(armX + 48, armY - 6 + armSwing * 0.3, 48, 8);
    ctx.fillStyle = COL.spatula;
    ctx.fillRect(armX + 50, armY - 6 + armSwing * 0.3, 44, 6);
  }

  function loop() {
    time += 1;
    const armFrame = time * 0.2;

    // Bounce: joyful little bob
    const bounce = Math.sin(time * 0.12) * 4;

    blinkTimer += 1;
    if (blink) {
      if (blinkTimer > 6) {
        blink = false;
        blinkTimer = 0;
      }
    } else if (blinkTimer > 100 + Math.random() * 40) {
      blink = true;
      blinkTimer = 0;
    }

    drawBackground();
    drawSteam();
    drawPan();
    drawEggs(armFrame);
    drawWoman(armFrame, blink, bounce);

    requestAnimationFrame(loop);
  }

  ctx.imageSmoothingEnabled = false;
  if ("webkitImageSmoothingEnabled" in ctx) ctx.webkitImageSmoothingEnabled = false;
  if ("mozImageSmoothingEnabled" in ctx) ctx.mozImageSmoothingEnabled = false;

  loop();
  console.log("🍳 Caro is Cooking — thanks for stopping by!");
})();
