// Spot the Difference — game state machine, timer, scoring, hints.
// Runs entirely in the browser from static files; no network requests.
import {
  LEVELS,
  FIND_POINTS,
  WRONG_TIME_PENALTY,
  WRONG_POINTS_PENALTY,
  HINTS_PER_LEVEL,
  HINT_COST,
  COMBO_EVERY,
  COMBO_BONUS,
  starsForLevel,
} from './config.js';
import { drawPanel, drawWrongFlashes, drawHud, drawFooter, drawOverlay, CANVAS_W, CANVAS_H } from './render.js';
import { panelHit, diffAtPoint, bindInput } from './input.js';
import { playFound, playWrong, playClick, playWin, playLose, playHint, toggleMute, isMuted } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const hintBtn = document.getElementById('hint-btn');
const restartBtn = document.getElementById('restart-btn');
const muteBtn = document.getElementById('mute-btn');

// Screen: 'title' | 'playing' | 'level-done' | 'game-over' | 'time-up'
const state = {
  screen: 'title',
  levelIndex: 0,
  levelCount: LEVELS.length,
  score: 0,
  found: [],
  hintsLeft: HINTS_PER_LEVEL,
  hint: null,
  timeLeftSec: 0,
  message: '',
  flashes: [],
  combo: 0,
  levelStars: [],
  lastTick: 0,
};

function currentLevel() {
  return LEVELS[state.levelIndex];
}

function startLevel(index) {
  const level = LEVELS[index];
  state.levelIndex = index;
  state.found = [];
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hint = null;
  state.timeLeftSec = level.timeLimitSec;
  state.message = `Find ${level.diffs.length} differences — ${level.subtitle}`;
  state.flashes = [];
  state.combo = 0;
  state.screen = 'playing';
  state.lastTick = performance.now();
}

function startGame() {
  state.score = 0;
  state.levelStars = [];
  startLevel(0);
}

function onPanelClick(hit, canvasPoint) {
  if (state.screen !== 'playing') return;
  const level = currentLevel();
  const d = diffAtPoint(level, state.found, hit.x, hit.y);
  if (d) {
    state.found.push(d.id);
    state.combo += 1;
    let gained = FIND_POINTS;
    if (state.combo % COMBO_EVERY === 0) gained += COMBO_BONUS;
    state.score += gained;
    state.message = `Found it — ${d.label}! (+${gained})`;
    playFound();
    if (state.found.length === level.diffs.length) {
      const bonus = Math.round(state.timeLeftSec) * 2;
      state.score += bonus;
      const stars = starsForLevel(state.timeLeftSec, level.timeLimitSec);
      state.levelStars.push(stars);
      state.message = `Level clear! Time bonus +${bonus} · ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`;
      playWin();
      state.screen = 'level-done';
    }
  } else {
    state.combo = 0;
    state.score = Math.max(0, state.score - WRONG_POINTS_PENALTY);
    state.timeLeftSec = Math.max(0, state.timeLeftSec - WRONG_TIME_PENALTY);
    state.flashes.push({ x: canvasPoint.x, y: canvasPoint.y, at: performance.now() });
    state.message = `Not a difference — minus ${WRONG_TIME_PENALTY}s, minus ${WRONG_POINTS_PENALTY} points. Look closer!`;
    playWrong();
  }
}

function onHint() {
  if (state.screen !== 'playing') return;
  const level = currentLevel();
  const remaining = level.diffs.filter((d) => !state.found.includes(d.id));
  if (remaining.length === 0) return;
  if (state.hintsLeft <= 0) {
    state.message = 'No hints left on this level.';
    return;
  }
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hint = { id: pick.id, level: state.levelIndex, until: performance.now() + 4000 };
  state.message = `Hint: look near the glowing ring… (−${HINT_COST} points)`;
  playHint();
}

function onRestart() {
  playClick();
  startLevel(state.levelIndex);
}

function onMute() {
  const nowMuted = toggleMute();
  muteBtn.textContent = nowMuted ? '🔇 Sound off' : '🔊 Sound on';
  if (!nowMuted) playClick();
}

function onConfirm() {
  if (state.screen === 'title') {
    playClick();
    startGame();
  } else if (state.screen === 'level-done') {
    playClick();
    if (state.levelIndex + 1 < LEVELS.length) startLevel(state.levelIndex + 1);
    else state.screen = 'game-over';
  } else if (state.screen === 'game-over' || state.screen === 'time-up') {
    playClick();
    startGame();
  }
}

function onEscape() {
  if (state.screen === 'playing') {
    state.screen = 'title';
    state.message = '';
  }
}

// The render loop: panels, HUD, flashes, and the screen overlays.
function frame(now) {
  const level = currentLevel();
  if (state.screen === 'playing') {
    const dt = (now - state.lastTick) / 1000;
    state.lastTick = now;
    state.timeLeftSec = Math.max(0, state.timeLeftSec - dt);
    if (state.hint && now > state.hint.until) state.hint = null;
    if (state.timeLeftSec <= 0) {
      state.screen = 'time-up';
      playLose();
    }
  } else {
    state.lastTick = now;
  }

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#eceff1';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  if (state.screen === 'title') {
    drawTitleScreen();
  } else {
    drawPanel(ctx, level, 0, state);
    drawPanel(ctx, level, 1, state);
    drawHud(ctx, level, state);
    drawFooter(ctx, state);
    drawWrongFlashes(ctx, state.flashes);
    if (state.screen === 'level-done') {
      const last = state.levelIndex + 1 < LEVELS.length;
      drawOverlay(ctx, [
        { text: 'Level clear!', font: 'bold 44px system-ui, sans-serif', color: '#a5d6a7', gap: 70 },
        { text: `You found all ${level.diffs.length} differences in ${level.name}.`, gap: 48 },
        { text: `Score ${state.score} — press Enter for ${last ? 'the next level' : 'your final score'}.` },
      ]);
    } else if (state.screen === 'game-over') {
      const totalStars = state.levelStars.reduce((a, b) => a + b, 0);
      drawOverlay(ctx, [
        { text: 'You found them all!', font: 'bold 44px system-ui, sans-serif', color: '#ffcc80', gap: 70 },
        { text: `Final score ${state.score} · ${totalStars} / ${LEVELS.length * 3} stars`, gap: 48 },
        { text: 'Press Enter to play again.' },
      ], '🏆');
    } else if (state.screen === 'time-up') {
      drawOverlay(ctx, [
        { text: 'Time is up!', font: 'bold 44px system-ui, sans-serif', color: '#ef5350', gap: 70 },
        { text: `You found ${state.found.length} of ${level.diffs.length} differences in ${level.name}.`, gap: 48 },
        { text: 'Press Enter to try again, or R to restart this level.' },
      ]);
    }
  }
  requestAnimationFrame(frame);
}

function drawTitleScreen() {
  drawOverlay(ctx, [
    { text: 'Find every difference between the two pictures.', gap: 48 },
    { text: 'Click a difference on either side to mark it. Wrong clicks cost time.', gap: 48 },
    { text: '3 scenes · 7, 8 and 9 differences · hints, combos and a ticking clock.', gap: 48 },
    { text: 'Press Enter or click Start to play.', color: '#ffcc80' },
  ], '🔍 Spot the Difference');
}

// Screenshot mode: ?shot=title|play|done|over&level=N&found=K renders a
// fixed state of the real game, for the entry screenshots.
function applyShotParams() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return;
  const levelIndex = Math.min(LEVELS.length - 1, Math.max(0, Number(params.get('level') || 0)));
  const foundCount = Math.min(LEVELS[levelIndex].diffs.length, Math.max(0, Number(params.get('found') || 0)));
  if (shot === 'title') {
    state.screen = 'title';
  } else if (shot === 'play') {
    startLevel(levelIndex);
    for (let i = 0; i < foundCount; i++) state.found.push(LEVELS[levelIndex].diffs[i].id);
    state.timeLeftSec = LEVELS[levelIndex].timeLimitSec - 47;
    state.message = `Found it — ${LEVELS[levelIndex].diffs[foundCount - 1]?.label || ''}!`;
    state.score = foundCount * FIND_POINTS;
  } else if (shot === 'done') {
    startLevel(levelIndex);
    state.found = LEVELS[levelIndex].diffs.map((d) => d.id);
    state.timeLeftSec = 61;
    state.score = 740;
    state.levelStars = [3];
    state.screen = 'level-done';
  } else if (shot === 'over') {
    state.score = 2140;
    state.levelStars = [3, 2, 3];
    state.screen = 'game-over';
  }
}

hintBtn.addEventListener('click', onHint);
restartBtn.addEventListener('click', onRestart);
muteBtn.addEventListener('click', onMute);
document.getElementById('start-btn').addEventListener('click', onConfirm);
bindInput(canvas, { onPanelClick, onHint, onRestart, onMute, onConfirm, onEscape });
applyShotParams();
requestAnimationFrame(frame);
