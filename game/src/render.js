// Canvas rendering: the two panels, found markers, hint pulse,
// wrong-click flashes, HUD, and the title / level / game-over screens.
import { PANEL, PANEL_X, PANEL_Y } from './config.js';
import { drawScene } from './scenes.js';

export const CANVAS_W = 1280;
export const CANVAS_H = 800;
export { PANEL_X, PANEL_Y };

// Draw one panel: the scene plus a frame and any found markers.
export function drawPanel(ctx, level, side, state) {
  const x0 = PANEL_X[side];
  const y0 = PANEL_Y;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y0, PANEL, PANEL);
  ctx.clip();
  ctx.translate(x0, y0);
  const applied = side === 1 ? new Set(level.diffs.map((d) => d.id)) : new Set();
  drawScene(ctx, level, applied);
  ctx.restore();

  // Frame.
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 4;
  ctx.strokeRect(x0, y0, PANEL, PANEL);
  ctx.fillStyle = '#37474f';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(side === 0 ? 'LEFT' : 'RIGHT', x0 + PANEL / 2, y0 - 12);

  // Markers for the differences already found, mirrored on both panels.
  for (const found of state.found) {
    const d = level.diffs.find((dd) => dd.id === found);
    if (!d) continue;
    drawFoundMarker(ctx, x0 + d.x, y0 + d.y, d.r);
  }

  // The hinted difference pulses on both panels.
  if (state.hint && state.hint.level === state.levelIndex) {
    const d = level.diffs.find((dd) => dd.id === state.hint.id);
    if (d && !state.found.includes(d.id)) {
      const pulse = 1 + 0.18 * Math.sin(performance.now() / 130);
      ctx.save();
      ctx.strokeStyle = '#ffeb3b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x0 + d.x, y0 + d.y, d.r * pulse + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawFoundMarker(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(46, 125, 50, 0.18)';
  ctx.fill();
  // Check mark inside the circle.
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y);
  ctx.lineTo(x - r * 0.1, y + r * 0.35);
  ctx.lineTo(x + r * 0.5, y - r * 0.35);
  ctx.stroke();
  ctx.restore();
}

// Top HUD: title, level name, score, found counter, and the timer bar.
export function drawHud(ctx, level, state) {
  ctx.fillStyle = '#263238';
  ctx.fillRect(0, 0, CANVAS_W, 96);
  ctx.fillStyle = '#eceff1';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Spot the Difference', 30, 42);
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillStyle = '#b0bec5';
  ctx.fillText(`Level ${state.levelIndex + 1} of ${state.levelCount} — ${level.name}`, 30, 74);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#eceff1';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText(`Score ${state.score}`, 1250, 42);
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillStyle = state.found.length === level.diffs.length ? '#a5d6a7' : '#ffcc80';
  ctx.fillText(`Found ${state.found.length} / ${level.diffs.length}`, 1250, 74);

  // Timer bar under the header; it turns red in the last 20 seconds.
  const frac = Math.max(0, state.timeLeftSec / level.timeLimitSec);
  ctx.fillStyle = '#455a64';
  ctx.fillRect(30, 104, 1220, 14);
  ctx.fillStyle = frac > 0.25 ? '#66bb6a' : '#ef5350';
  ctx.fillRect(30, 104, 1220 * frac, 14);
  ctx.fillStyle = '#eceff1';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'right';
  const mins = Math.floor(state.timeLeftSec / 60);
  const secs = Math.floor(state.timeLeftSec % 60);
  ctx.fillText(`${mins}:${String(secs).padStart(2, '0')}`, 1250, 134);
}

// Bottom strip: hints left, last message, and the key hints.
export function drawFooter(ctx, state) {
  ctx.fillStyle = '#263238';
  ctx.fillRect(0, 724, CANVAS_W, 76);
  ctx.fillStyle = '#b0bec5';
  ctx.font = '20px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Hints left: ${state.hintsLeft}  (press H)`, 30, 762);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#eceff1';
  ctx.fillText(state.message || '', CANVAS_W / 2, 762);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#b0bec5';
  ctx.fillText('M mute · R restart · H hint', 1250, 762);
}

// Full-screen overlay panel used by the title and end screens.
export function drawOverlay(ctx, lines, accent) {
  ctx.fillStyle = 'rgba(13, 27, 62, 0.88)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = 'center';
  let y = 250;
  for (const line of lines) {
    ctx.fillStyle = line.color || '#eceff1';
    ctx.font = line.font || '28px system-ui, sans-serif';
    ctx.fillText(line.text, CANVAS_W / 2, y);
    y += line.gap || 56;
  }
  if (accent) {
    ctx.fillStyle = accent;
    ctx.font = 'bold 64px system-ui, sans-serif';
    ctx.fillText(accent, CANVAS_W / 2, 180);
  }
}

// A red X flash where a wrong click landed, fading with age.
export function drawWrongFlashes(ctx, flashes) {
  const now = performance.now();
  for (const f of flashes) {
    const age = (now - f.at) / 600;
    if (age >= 1) continue;
    ctx.save();
    ctx.globalAlpha = 1 - age;
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const s = 14;
    ctx.beginPath();
    ctx.moveTo(f.x - s, f.y - s);
    ctx.lineTo(f.x + s, f.y + s);
    ctx.moveTo(f.x + s, f.y - s);
    ctx.lineTo(f.x - s, f.y + s);
    ctx.stroke();
    ctx.restore();
  }
}
