// Level and difference data for Spot the Difference.
// Scene space is 560 x 560 per panel. Each difference has a hit zone
// (x, y, radius) in scene coordinates and a short label shown when found.
// The right panel applies every difference; the left panel applies none.

export const PANEL = 560;
export const PANEL_GAP = 80;
// Panel origins on the 1280 x 800 canvas.
export const PANEL_X = [30, 690];
export const PANEL_Y = 150;

export const LEVELS = [
  {
    id: 'garden',
    name: 'Sunny Garden',
    subtitle: 'A quiet afternoon in the garden',
    timeLimitSec: 150,
    diffs: [
      { id: 'bird', x: 428, y: 74, r: 30, label: 'A bird in the sky' },
      { id: 'shades', x: 96, y: 86, r: 34, label: 'The sun wears shades' },
      { id: 'flower', x: 118, y: 468, r: 30, label: 'A purple flower' },
      { id: 'apple', x: 452, y: 218, r: 28, label: 'An apple on the tree' },
      { id: 'cat', x: 348, y: 394, r: 32, label: 'The cat is gone' },
      { id: 'duck', x: 108, y: 498, r: 30, label: 'A duck in the pond' },
      { id: 'curtains', x: 258, y: 300, r: 30, label: 'Closed curtains' },
    ],
  },
  {
    id: 'camp',
    name: 'Night Camp',
    subtitle: 'Fireflies and marshmallows by the tent',
    timeLimitSec: 140,
    diffs: [
      { id: 'owl', x: 92, y: 148, r: 30, label: 'An owl in the pine' },
      { id: 'star', x: 498, y: 62, r: 28, label: 'One extra star' },
      { id: 'flag', x: 282, y: 176, r: 28, label: 'A flag on the tent' },
      { id: 'mug', x: 402, y: 428, r: 28, label: 'A mug on the log' },
      { id: 'moon', x: 462, y: 92, r: 34, label: 'An orange moon' },
      { id: 'marshmallow', x: 268, y: 402, r: 30, label: 'No marshmallow' },
      { id: 'patch', x: 148, y: 452, r: 28, label: 'A green backpack patch' },
      { id: 'firefly', x: 482, y: 382, r: 30, label: 'A firefly by the bush' },
    ],
  },
  {
    id: 'reef',
    name: 'Coral Reef',
    subtitle: 'Down where the clownfish play',
    timeLimitSec: 130,
    diffs: [
      { id: 'yellowfish', x: 448, y: 118, r: 30, label: 'A yellow fish' },
      { id: 'stripes', x: 210, y: 250, r: 34, label: 'White stripes' },
      { id: 'starfish', x: 120, y: 492, r: 30, label: 'A six-armed starfish' },
      { id: 'bubbles', x: 198, y: 148, r: 30, label: 'Extra bubbles' },
      { id: 'pearl', x: 330, y: 478, r: 30, label: 'A pearl in the clam' },
      { id: 'coral', x: 462, y: 300, r: 30, label: 'An orange coral' },
      { id: 'seaweed', x: 68, y: 330, r: 32, label: 'The tall seaweed is gone' },
      { id: 'chest', x: 478, y: 482, r: 30, label: 'A treasure chest' },
      { id: 'seahorse', x: 92, y: 296, r: 30, label: 'A seahorse' },
    ],
  },
];

// Points for one correct find, before the combo multiplier.
export const FIND_POINTS = 100;
// Seconds lost on a wrong click.
export const WRONG_TIME_PENALTY = 3;
// Points lost on a wrong click.
export const WRONG_POINTS_PENALTY = 10;
// Hints available per level.
export const HINTS_PER_LEVEL = 3;
// Points a hint costs.
export const HINT_COST = 25;
// Combo: every third consecutive correct find without a miss earns a bonus.
export const COMBO_EVERY = 3;
export const COMBO_BONUS = 50;

// Stars for a finished level, from the share of the time limit left.
export function starsForLevel(timeLeftSec, timeLimitSec) {
  const share = timeLeftSec / timeLimitSec;
  if (share >= 0.45) return 3;
  if (share >= 0.2) return 2;
  return 1;
}

