// Pointer and keyboard input: map a click on either panel back to
// scene coordinates, and translate keys into game actions.
import { PANEL, PANEL_X, PANEL_Y } from './config.js';

// Which panel (0 left, 1 right) holds this canvas point, if any,
// and the point in that panel's scene coordinates.
export function panelHit(canvasX, canvasY) {
  for (let side = 0; side < 2; side++) {
    const x0 = PANEL_X[side];
    const y0 = PANEL_Y;
    if (canvasX >= x0 && canvasX < x0 + PANEL && canvasY >= y0 && canvasY < y0 + PANEL) {
      return { side, x: canvasX - x0, y: canvasY - y0 };
    }
  }
  return null;
}

// Convert a DOM pointer event into canvas coordinates, honoring the
// canvas element's on-screen size versus its backing resolution.
export function eventToCanvas(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

// Find the unfound difference whose hit zone contains the scene point,
// or null when the click lands on nothing.
export function diffAtPoint(level, found, x, y) {
  for (const d of level.diffs) {
    if (found.includes(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return d;
  }
  return null;
}

// Wire the canvas click and the keyboard to the callbacks the game
// supplies. Returns a function that removes the listeners again.
export function bindInput(canvas, handlers) {
  const onClick = (event) => {
    const p = eventToCanvas(canvas, event);
    const hit = panelHit(p.x, p.y);
    if (hit) handlers.onPanelClick(hit, p);
  };
  const onKey = (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onHint();
    else if (key === 'r') handlers.onRestart();
    else if (key === 'm') handlers.onMute();
    else if (key === 'enter') handlers.onConfirm();
    else if (key === 'escape') handlers.onEscape();
  };
  canvas.addEventListener('click', onClick);
  window.addEventListener('keydown', onKey);
  return () => {
    canvas.removeEventListener('click', onClick);
    window.removeEventListener('keydown', onKey);
  };
}
