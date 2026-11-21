// Procedural scene painters. Every scene is drawn twice: the left panel
// with no differences applied, the right panel with all of them applied.
// `applied` is a Set of difference ids to apply on this panel.
// All art is original, drawn with canvas 2D shapes — no image files.

export function drawScene(ctx, level, applied) {
  if (level.id === 'garden') drawGarden(ctx, applied);
  else if (level.id === 'camp') drawCamp(ctx, applied);
  else drawReef(ctx, applied);
}

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y - 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 48 * s, y, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y + 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.fill();
}

function flower(ctx, x, y, petal, center) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 6, petal);
  }
  circle(ctx, x, y, 6, center);
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x, y + 26);
  ctx.stroke();
}

// ---- Level 1: Sunny Garden ----
function drawGarden(ctx, applied) {
  const sky = ctx.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, '#7ec8f7');
  sky.addColorStop(0.55, '#bfe6fb');
  sky.addColorStop(0.56, '#8bc34a');
  sky.addColorStop(1, '#558b2f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 560);

  // Sun (top left). On the right panel it wears sunglasses.
  circle(ctx, 96, 86, 42, '#ffeb3b');
  ctx.strokeStyle = '#f9a825';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(96 + Math.cos(a) * 50, 86 + Math.sin(a) * 50);
    ctx.lineTo(96 + Math.cos(a) * 62, 86 + Math.sin(a) * 62);
    ctx.stroke();
  }
  circle(ctx, 86, 80, 4, '#5d4037');
  circle(ctx, 106, 80, 4, '#5d4037');
  ctx.beginPath();
  ctx.arc(96, 96, 12, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 3;
  ctx.stroke();
  if (applied.has('shades')) {
    rect(ctx, 68, 72, 56, 16, '#212121');
    rect(ctx, 64, 78, 6, 4, '#212121');
    rect(ctx, 122, 78, 6, 4, '#212121');
  }

  cloud(ctx, 210, 90, 1);
  cloud(ctx, 380, 60, 0.8);
  cloud(ctx, 480, 140, 0.7);

  // Extra bird, right panel only.
  if (applied.has('bird')) {
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(416, 74, 10, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(436, 74, 10, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // House in the middle.
  rect(ctx, 200, 280, 160, 120, '#fff3e0');
  poly(ctx, [[185, 282], [280, 205], [375, 282]], '#e53935');
  rect(ctx, 262, 330, 36, 70, '#8d6e63');
  circle(ctx, 292, 368, 3, '#ffd54f');
  // Window with curtains: open on the left, closed on the right.
  rect(ctx, 214, 300, 44, 44, '#bbdefb');
  if (applied.has('curtains')) {
    rect(ctx, 214, 300, 44, 44, '#1a237e');
    ctx.strokeStyle = '#3949ab';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(236, 300);
    ctx.lineTo(236, 344);
    ctx.stroke();
  } else {
    rect(ctx, 214, 300, 10, 44, '#ffccbc');
    rect(ctx, 248, 300, 10, 44, '#ffccbc');
  }
  rect(ctx, 306, 300, 44, 44, '#bbdefb');
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 3;
  ctx.strokeRect(306, 300, 44, 44);
  ctx.beginPath();
  ctx.moveTo(328, 300);
  ctx.lineTo(328, 344);
  ctx.moveTo(306, 322);
  ctx.lineTo(350, 322);
  ctx.stroke();

  // Tree on the right.
  rect(ctx, 440, 250, 22, 110, '#6d4c41');
  circle(ctx, 452, 210, 58, '#43a047');
  circle(ctx, 410, 240, 40, '#388e3c');
  circle(ctx, 494, 240, 40, '#2e7d32');
  if (applied.has('apple')) {
    circle(ctx, 452, 218, 10, '#e53935');
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(452, 208);
    ctx.lineTo(452, 200);
    ctx.stroke();
  }

  // Fence across the garden, with a cat on the left panel only.
  ctx.fillStyle = '#a1887f';
  for (let x = 20; x < 560; x += 46) rect(ctx, x, 392, 10, 44, '#a1887f');
  rect(ctx, 0, 400, 560, 8, '#8d6e63');
  rect(ctx, 0, 424, 560, 8, '#8d6e63');
  if (!applied.has('cat')) {
    // Sitting cat on the fence, clear of the door.
    ellipse(ctx, 348, 384, 16, 14, '#ff9800');
    circle(ctx, 348, 364, 11, '#ff9800');
    poly(ctx, [[340, 356], [342, 342], [348, 354]], '#ff9800');
    poly(ctx, [[356, 356], [354, 342], [348, 354]], '#ff9800');
    ctx.strokeStyle = '#ff9800';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(360, 384, 12, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }

  // Pond, bottom left, with a duck on the right panel only.
  ellipse(ctx, 110, 500, 82, 30, '#4fc3f7');
  ellipse(ctx, 110, 496, 70, 22, '#81d4fa');
  ctx.strokeStyle = '#0288d1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(80, 498, 18, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.arc(140, 504, 14, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  if (applied.has('duck')) {
    ellipse(ctx, 108, 494, 14, 10, '#ffee58');
    circle(ctx, 120, 484, 8, '#ffee58');
    poly(ctx, [[127, 483], [136, 486], [127, 489]], '#ff9800');
    circle(ctx, 122, 482, 2, '#212121');
  }

  // Flower bed along the bottom. One flower turns purple on the right.
  const spots = [[60, 540], [120, 468], [180, 540], [360, 540], [430, 540], [500, 540]];
  for (const [fx, fy] of spots) {
    const petal = applied.has('flower') && fx === 120 ? '#ab47bc' : '#ef5350';
    flower(ctx, fx, fy, petal, '#ffeb3b');
  }
  flower(ctx, 250, 540, '#ef5350', '#ffeb3b');
  flower(ctx, 320, 468, '#ef5350', '#ffeb3b');

  // Path from the door.
  poly(ctx, [[268, 400], [292, 400], [310, 560], [250, 560]], '#d7ccc8');
  ctx.strokeStyle = '#bcaaa4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(280, 430);
  ctx.lineTo(280, 540);
  ctx.stroke();
}

// ---- Level 2: Night Camp ----
function drawCamp(ctx, applied) {
  const sky = ctx.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, '#0d1b3e');
  sky.addColorStop(0.6, '#1a2f5e');
  sky.addColorStop(0.61, '#1b3a24');
  sky.addColorStop(1, '#0f2417');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 560);

  // Stars, one extra on the right panel.
  const stars = [[60, 60], [140, 40], [220, 80], [300, 44], [380, 90], [520, 130], [40, 150], [180, 130], [340, 140], [520, 200]];
  ctx.fillStyle = '#fffde7';
  for (const [sx, sy] of stars) {
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (applied.has('star')) {
    ctx.fillStyle = '#fff9c4';
    ctx.beginPath();
    ctx.arc(498, 62, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff9c4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(498, 50);
    ctx.lineTo(498, 74);
    ctx.moveTo(486, 62);
    ctx.lineTo(510, 62);
    ctx.stroke();
  }

  // Moon: pale yellow left, orange right.
  circle(ctx, 462, 92, 36, applied.has('moon') ? '#fb8c00' : '#fff9c4');
  circle(ctx, 450, 84, 7, applied.has('moon') ? '#e65100' : '#e0e0e0');
  circle(ctx, 472, 102, 5, applied.has('moon') ? '#e65100' : '#e0e0e0');
  circle(ctx, 470, 80, 4, applied.has('moon') ? '#e65100' : '#e0e0e0');

  // Pine trees on the left, one holding an owl on the right panel.
  function pine(x, y, s) {
    poly(ctx, [[x, y - 90 * s], [x - 42 * s, y], [x + 42 * s, y]], '#1b5e20');
    poly(ctx, [[x, y - 60 * s], [x - 34 * s, y + 26 * s], [x + 34 * s, y + 26 * s]], '#2e7d32');
    rect(ctx, x - 6 * s, y + 24 * s, 12 * s, 22 * s, '#4e342e');
  }
  pine(92, 300, 1);
  pine(510, 320, 0.85);
  if (applied.has('owl')) {
    ellipse(ctx, 92, 148, 14, 18, '#8d6e63');
    circle(ctx, 86, 142, 5, '#fffde7');
    circle(ctx, 98, 142, 5, '#fffde7');
    circle(ctx, 86, 142, 2.5, '#212121');
    circle(ctx, 98, 142, 2.5, '#212121');
    poly(ctx, [[92, 148], [88, 154], [96, 154]], '#ffb300');
  }

  // Tent in the middle.
  poly(ctx, [[180, 380], [280, 200], [380, 380]], '#ff7043');
  poly(ctx, [[240, 380], [280, 200], [320, 380]], '#f4511e');
  poly(ctx, [[252, 380], [280, 290], [308, 380]], '#4e342e');
  ctx.strokeStyle = '#bf360c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(280, 200);
  ctx.lineTo(280, 176);
  ctx.stroke();
  if (applied.has('flag')) {
    poly(ctx, [[280, 176], [306, 182], [280, 190]], '#ffee58');
  }

  // Campfire with logs.
  ellipse(ctx, 268, 440, 46, 12, '#3e2723');
  poly(ctx, [[248, 402], [272, 428], [288, 402]], '#ff9800');
  poly(ctx, [[288, 402], [268, 428], [250, 402]], '#ff5722');
  poly(ctx, [[252, 428], [284, 428], [300, 444], [236, 444]], '#6d4c41');
  ctx.strokeStyle = '#ffca28';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(268, 404, 10, 0, Math.PI * 2);
  ctx.stroke();
  // Marshmallow on a stick: present on the left, gone on the right.
  if (!applied.has('marshmallow')) {
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(240, 380);
    ctx.lineTo(262, 400);
    ctx.stroke();
    rect(ctx, 256, 392, 14, 12, '#fff8e1');
  }

  // Backpack on the ground, its patch red left, green right.
  rect(ctx, 128, 430, 44, 48, '#5d4037');
  ellipse(ctx, 150, 426, 20, 10, '#795548');
  rect(ctx, 142, 448, 16, 16, applied.has('patch') ? '#43a047' : '#e53935');

  // Log seat with a mug on the right panel only.
  rect(ctx, 380, 420, 64, 20, '#6d4c41');
  ellipse(ctx, 380, 420, 8, 10, '#8d6e63');
  ellipse(ctx, 444, 420, 8, 10, '#8d6e63');
  if (applied.has('mug')) {
    rect(ctx, 394, 398, 18, 22, '#29b6f6');
    ctx.strokeStyle = '#29b6f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(416, 409, 6, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.strokeStyle = '#e1f5fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 396);
    ctx.quadraticCurveTo(402, 388, 400, 382);
    ctx.moveTo(408, 396);
    ctx.quadraticCurveTo(410, 388, 408, 382);
    ctx.stroke();
  }

  // Firefly glowing by the bush, right panel only.
  if (applied.has('firefly')) {
    ctx.fillStyle = '#c6ff00';
    ctx.beginPath();
    ctx.arc(482, 382, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(198, 255, 0, 0.25)';
    ctx.beginPath();
    ctx.arc(482, 382, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bushes and grass tufts.
  circle(ctx, 60, 500, 34, '#1b5e20');
  circle(ctx, 100, 510, 26, '#2e7d32');
  circle(ctx, 500, 505, 30, '#1b5e20');
  ctx.strokeStyle = '#43a047';
  ctx.lineWidth = 2;
  for (const [gx, gy] of [[200, 520], [330, 520], [430, 520], [40, 540], [540, 540]]) {
    ctx.beginPath();
    ctx.moveTo(gx - 8, gy);
    ctx.lineTo(gx, gy - 14);
    ctx.lineTo(gx + 8, gy);
    ctx.stroke();
  }
}

// ---- Level 3: Coral Reef ----
function drawReef(ctx, applied) {
  const water = ctx.createLinearGradient(0, 0, 0, 560);
  water.addColorStop(0, '#0288d1');
  water.addColorStop(0.6, '#039be5');
  water.addColorStop(0.61, '#f4e3c2');
  water.addColorStop(1, '#d9b380');
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, 560, 560);

  // Light rays from the surface.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
  poly(ctx, [[80, 0], [140, 0], [60, 340], [0, 340]], 'rgba(255, 255, 255, 0.10)');
  poly(ctx, [[300, 0], [340, 0], [300, 340], [240, 340]], 'rgba(255, 255, 255, 0.10)');

  // Bubbles rising; an extra trail on the right panel.
  const bubbles = [[150, 220, 6], [165, 190, 4], [180, 160, 5], [320, 200, 6], [335, 170, 4]];
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  for (const [bx, by, br] of bubbles) {
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (applied.has('bubbles')) {
    for (const [bx, by, br] of [[198, 148, 5], [208, 120, 4], [216, 94, 6]]) {
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Tall seaweed, present on the left only.
  if (!applied.has('seaweed')) {
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(68, 540);
    ctx.quadraticCurveTo(50, 440, 68, 330);
    ctx.stroke();
    ctx.strokeStyle = '#43a047';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(68, 540);
    ctx.quadraticCurveTo(84, 450, 66, 380);
    ctx.stroke();
  }
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(520, 540);
  ctx.quadraticCurveTo(540, 460, 520, 380);
  ctx.stroke();

  // Seahorse, right panel only.
  if (applied.has('seahorse')) {
    ctx.strokeStyle = '#ff8f00';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(92, 300, 16, 0, Math.PI * 1.5);
    ctx.stroke();
    circle(ctx, 96, 282, 9, '#ff8f00');
    poly(ctx, [[104, 276], [116, 272], [106, 282]], '#ff8f00');
    circle(ctx, 99, 280, 2, '#212121');
  }

  // Clownfish in the middle: orange stripes left, white stripes right.
  function clownfish(x, y, s, stripeFill) {
    ellipse(ctx, x, y, 34 * s, 20 * s, '#ff7043');
    poly(ctx, [[x + 30 * s, y], [x + 48 * s, y - 14 * s], [x + 48 * s, y + 14 * s]], '#ff7043');
    ctx.fillStyle = stripeFill;
    ctx.fillRect(x - 12 * s, y - 18 * s, 8 * s, 36 * s);
    ctx.fillRect(x + 8 * s, y - 16 * s, 7 * s, 32 * s);
    circle(ctx, x - 22 * s, y - 4 * s, 3, '#212121');
  }
  clownfish(210, 250, 1, applied.has('stripes') ? '#ffffff' : '#ff7043');
  clownfish(330, 170, 0.7, '#ffffff');

  // Extra yellow fish, right panel only.
  if (applied.has('yellowfish')) {
    ellipse(ctx, 448, 118, 26, 14, '#ffee58');
    poly(ctx, [[472, 118], [488, 106], [488, 130]], '#ffee58');
    circle(ctx, 432, 114, 3, '#212121');
  }

  // Coral branches: pink left, orange right.
  const coralFill = applied.has('coral') ? '#fb8c00' : '#ec407a';
  ctx.strokeStyle = coralFill;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(462, 540);
  ctx.lineTo(462, 420);
  ctx.moveTo(462, 460);
  ctx.lineTo(430, 400);
  ctx.moveTo(462, 460);
  ctx.lineTo(496, 400);
  ctx.moveTo(462, 420);
  ctx.lineTo(462, 360);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Clam with a pearl on the right panel.
  ellipse(ctx, 330, 486, 34, 14, '#b39ddb');
  if (applied.has('pearl')) {
    ellipse(ctx, 330, 472, 30, 12, '#d1c4e9');
    circle(ctx, 330, 470, 7, '#ffffff');
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(327, 467, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Starfish: five arms left, six on the right.
  function starfish(cx, cy, arms) {
    ctx.fillStyle = '#ff7043';
    ctx.beginPath();
    for (let i = 0; i < arms * 2; i++) {
      const a = (i / (arms * 2)) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 22 : 9;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    circle(ctx, cx - 5, cy - 2, 2, '#bf360c');
    circle(ctx, cx + 5, cy - 2, 2, '#bf360c');
  }
  starfish(120, 492, applied.has('starfish') ? 6 : 5);

  // Treasure chest, right panel only.
  if (applied.has('chest')) {
    rect(ctx, 452, 470, 52, 30, '#6d4c41');
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(452, 470, 52, 8);
    ctx.fillRect(474, 470, 8, 30);
    ctx.beginPath();
    ctx.arc(478, 478, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd54f';
    ctx.fill();
  }

  // Sand ripples.
  ctx.strokeStyle = '#b08d57';
  ctx.lineWidth = 2;
  for (const [rx, ry] of [[60, 520], [200, 530], [380, 520], [500, 530]]) {
    ctx.beginPath();
    ctx.arc(rx, ry, 22, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }
}
