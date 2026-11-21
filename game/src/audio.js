// Tiny synthesized sound effects with the Web Audio API.
// No audio files: everything is an oscillator, so the game stays offline.

let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol) {
  const ac = ctx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

// A satisfying two-note chime when a difference is found.
export function playFound() {
  tone(660, 0, 0.14, 'sine', 0.25);
  tone(990, 0.09, 0.22, 'sine', 0.25);
}

// A soft low buzz for a wrong click.
export function playWrong() {
  tone(160, 0, 0.18, 'sawtooth', 0.12);
}

// A short tick for button presses.
export function playClick() {
  tone(520, 0, 0.06, 'triangle', 0.15);
}

// A shimmering arpeggio when a level is cleared.
export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => tone(f, i * 0.11, 0.28, 'sine', 0.22));
}

// A descending sigh when time runs out.
export function playLose() {
  tone(392, 0, 0.2, 'sine', 0.2);
  tone(311, 0.18, 0.2, 'sine', 0.2);
  tone(233, 0.36, 0.4, 'sine', 0.2);
}

// A sparkle when a hint lights up.
export function playHint() {
  tone(1175, 0, 0.1, 'sine', 0.18);
  tone(1568, 0.07, 0.16, 'sine', 0.18);
}
