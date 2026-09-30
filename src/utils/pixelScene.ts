// Procedural pixel-art storm scene — Indra wielding the Vajra amid cyclone clouds.
// Zero image assets; everything is generated as tiled-rect SVG (crisp pixel look).
const W = 320, H = 180;
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const r = (x: number, y: number, w: number, h: number, c: string, o = 1) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"${o < 1 ? ` opacity="${o}"` : ''}/>`;
const wrap = (b: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid slice">${b}</svg>`;
const uri = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

// px(): draw a "sprite" from a row-based bitmap of colour codes, blocky and scaled.
function px(grid: string[], palette: Record<string, string>, ox: number, oy: number, s: number, o = 1) {
  let b = '';
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch !== '.' && palette[ch]) {
        let run = 1;
        while (row[x + run] === ch) run++;
        b += r(ox + x * s, oy + y * s, run * s, s, palette[ch], o);
        x += run;
      } else x++;
    }
  });
  return b;
}

function scene() {
  // Reset seed so every generation is deterministic and stable
  seed = 7;

  // Dusky lilac-slate storm sky (pastel but heavy, not candy)
  const sky = ['#3A3560', '#41406C', '#484A78', '#4F5686', '#5A6392', '#68729C', '#7A82A8', '#8D93B4', '#A3A7C2', '#B7BAD0', '#C9CCDE', '#DADCE8'];
  let b = '';
  sky.forEach((c, i) => {
    b += r(0, i * 9, W, 9, c);
    const n = sky[i + 1];
    if (n) for (let x = 0; x < W; x += 2) b += r(x, i * 9 + 8, 1, 1, n) + r(x + 1, i * 9 + 7, 1, 1, n);
  });

  // distant stars breaking through storm
  for (let i = 0; i < 22; i++) {
    const x = (rnd() * W) | 0, y = (rnd() * 46) | 0, o = 0.3 + rnd() * 0.5;
    b += r(x, y, 1, 1, '#EDEFFA', o);
  }

  // heavy storm clouds banked across the horizon
  const cloudBank = (cy: number, tone: string, shadow: string) => {
    for (let x = -10; x < W + 10; x += 8) {
      const h = 10 + ((Math.sin(x * 0.09 + seed) + 1) * 9) | 0;
      b += r(x, cy - h, 10, h, tone, 0.9);
      b += r(x, cy - Math.max(2, h - 6), 10, 4, shadow, 0.55);
    }
  };
  cloudBank(96, '#6B6F94', '#4A4E70');
  cloudBank(112, '#585C82', '#3C3F60');

  // === INDRA silhouette, arm raised with the Vajra, storm-lit from behind ===
  const P = {
    '#': '#211B3A', // deep silhouette
    o: '#2E2650', // silhouette highlight edge
    v: '#EFE6FF', // vajra glow (pale violet-white)
    g: '#C7B8FF', // vajra core gold-violet
  };
  const indra = [
    '.......#####........',
    '......#######.......',
    '......#o###o#........',
    '.......#####v.......',
    '......#g#####v......',
    '.....##g######v.....',
    '....###g#######v....',
    '...####g########v...',
    '...####g#########v..',
    '....###g#######......',
    '.....##g######.......',
    '......##g####........',
    '.......##g###........',
    '.......##g####.......',
    '......###o#####......',
    '.....######o####.....',
    '.....######o#####....',
    '.....#####o######....',
    '.....####o#######....',
    '......###########....',
    '......###.###o##.....',
    '......##...##.o##....',
    '.....###...###.o#....',
    '.....##.....##..#....',
    '.....##.....##.......',
    '.....##.....##.......',
    '....###.....###......',
    '....##.......##......',
  ];
  b += px(indra, P, 96, 24, 3, 0.97);

  // Vajra glow burst at the raised hand (upper right of figure)
  const vx = 96 + 15 * 3, vy = 24 + 3 * 3;
  for (let i = 0; i < 5; i++) {
    b += r(vx - i * 2, vy - i, 4 + i * 4, 2, '#F4ECFF', 0.5 - i * 0.08);
  }
  b += r(vx - 2, vy - 2, 8, 8, '#FFFFFF', 0.85);
  b += r(vx - 5, vy - 5, 14, 14, '#D9C9FF', 0.35);

  // jagged lightning bolts forking from the vajra hand down through clouds
  const bolt = (sx: number, sy: number, len: number, dir: number, w: number, col: string, glow: string) => {
    let x = sx, y = sy;
    for (let i = 0; i < len; i++) {
      const dx = (Math.sin(i * 1.7 + dir) * 5) | 0;
      x += dx + dir;
      y += 4;
      b += r(x - 3, y, w + 6, 5, glow, 0.22);
      b += r(x, y, w, 4, col, 0.95);
    }
  };
  bolt(vx, vy, 15, 1, 3, '#F6EEFF', '#B9A6FF');
  bolt(vx + 6, vy + 18, 7, 3, 2, '#E7DBFF', '#B9A6FF');
  bolt(vx - 30, vy + 6, 9, -2, 2, '#E7DBFF', '#B9A6FF');

  // rim-light halo around Indra from the storm glow
  b += r(96 + 2 * 3, 24 + 1 * 3, 3, 3, '#FFFFFF', 0.4);
  b += r(96 - 4, 24 + 8, 6, 30, '#EFE6FF', 0.08);

  // rain streaks
  for (let i = 0; i < 46; i++) {
    const x = (rnd() * W) | 0, y = 100 + ((rnd() * 70) | 0);
    b += r(x, y, 1, 4 + ((rnd() * 5) | 0), '#DCE0F2', 0.22 + rnd() * 0.2);
  }

  // roiling sea below
  const sea = ['#565C86', '#4C527A', '#43486E', '#3B3F62', '#333756', '#2C2F4A', '#26293F', '#212436'];
  sea.forEach((c, i) => {
    b += r(0, 132 + i * 6, W, 6, c);
    for (let k = 0; k < 8; k++) b += r((rnd() * (W - 12)) | 0, 132 + i * 6 + ((rnd() * 5) | 0), 4 + ((rnd() * 8) | 0), 1, '#8B90B8', 0.25);
  });

  // silhouetted coastline / ruins in foreground for scale
  const hills = [[0, 168], [20, 160], [46, 164], [70, 156], [96, 162], [150, 158], [210, 164], [260, 156], [320, 162]];
  hills.forEach(([x, y], i) => {
    const nx = hills[i + 1]?.[0] ?? W;
    b += r(x, y, nx - x, H - y, '#1A1830');
  });

  return wrap(b);
}

function clouds() {
  let b = '';
  const cloud = (x: number, y: number, s: number, o: number) => {
    const rows: [number, number, number][] = [[5, 0, 7], [2, 1, 13], [0, 2, 17], [0, 3, 17]];
    [0, -W].forEach((off) => {
      rows.forEach(([dx, dy, w]) => (b += r(x + dx * s + off, y + dy * s, w * s, s, '#9298BE', o)));
      b += r(x + off, y + 4 * s, 17 * s, s, '#767CA4', o) + r(x + 3 * s + off, y + 5 * s, 11 * s, s, '#5F6490', o * 0.85);
    });
  };
  [[10, 20, 2, 0.85], [96, 54, 3, 0.7], [170, 12, 2, 0.8], [214, 66, 2, 0.65], [268, 28, 3, 0.75], [130, 80, 2, 0.55], [48, 88, 2, 0.5]].forEach(([x, y, s, o]) => cloud(x, y, s, o));
  return wrap(b);
}

export function applyPixelScene() {
  if (typeof document === 'undefined') return;
  const s = document.documentElement.style;
  s.setProperty('--pixel-sky', uri(scene()));
  s.setProperty('--pixel-clouds', uri(clouds()));
}
