// imaginarium — IMAGINARIUM FOUNDRY · Bauhaus kinetic poster (10 s, 120 BPM)
// Canvas2D only (no WebGL) so it renders fast without a GPU. Every frame is a pure function of t.
// 0-2 s grid draws, red circle lands · 2-6 s one shape per beat assembles the poster · 6-8 s tile cascade (hero)
// · 8-10 s locked poster, clock hand ticks on the beat.
const W = 1920, H = 1080, M = 120;
window.DEMO = { width: W, height: H, fps: 30, duration: 10, motionBlur: { samples: 4, shutter: 0.5 } };
const BASE = '/demos/imaginarium/';
const cues = await (await fetch(BASE + 'cues.json')).json();
const T = Object.fromEntries(cues.events.map(e => [e.id, e.t]));
const DROP = cues.drop, FREEZE = cues.freeze;

const COL = { paper: '#F1E9DA', red: '#E03C31', yel: '#F2B705', blue: '#1E4FA3', ink: '#111111' };

// ---------------------------------------------------------------- easing / helpers
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const io2 = u => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);   // power2.inOut, no overshoot
const in2 = u => u * u;
const prog = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
const lerp = (a, b, u) => a + (b - a) * u;
const act = (t, land, dur = 0.4) => io2(prog(t, land - dur, land));          // move that lands exactly on `land`

const out = document.getElementById('out');
const g = out.getContext('2d', { alpha: false });

// ---------------------------------------------------------------- paper grain (seeded, built once)
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const grain = document.createElement('canvas'); grain.width = W; grain.height = H;
{
  const gc = grain.getContext('2d'), img = gc.createImageData(W, H), r = rng(7);
  for (let i = 0; i < W * H; i++) { const v = 200 + r() * 55; img.data.set([v, v, v, 255], i * 4); }
  gc.putImageData(img, 0, 0);
}

// ---------------------------------------------------------------- type metrics
await document.fonts.load('900 100px "Inter Display"');
await document.fonts.load('600 20px "Inter"');
const TITLE = 'IMAGINARIUM';
const titleFit = (() => {                       // ink length = exactly 7 modules (rows 1..8), tracking fills the rest
  g.font = '900 100px "Inter Display"';
  const w100 = g.measureText(TITLE).width;
  const size = 100 * (6.7 * M) / w100;
  g.font = `900 ${size}px "Inter Display"`;
  const m = g.measureText(TITLE), capH = g.measureText('H').actualBoundingBoxAscent;
  const ink = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  return { size, capH, track: (7 * M - ink) / (TITLE.length - 1), left: m.actualBoundingBoxLeft };
})();

// ---------------------------------------------------------------- drawing primitives
const fill = (col, path) => { g.fillStyle = col; g.beginPath(); path(); g.fill(); };
const circle = (cx, cy, r) => () => g.arc(cx, cy, r, 0, Math.PI * 2);
const sector = (px, py, r, a0) => () => { g.moveTo(px, py); g.arc(px, py, r, a0, a0 + Math.PI / 2); g.closePath(); };
const semi = (cx, cy, r) => () => { g.moveTo(cx - r, cy); g.arc(cx, cy, r, Math.PI, 0); g.closePath(); };
function spaced(str, x, y, track) {             // fillText with manual tracking (deterministic across Chrome builds)
  for (const ch of str) { g.fillText(ch, x, y); x += g.measureText(ch).width + track; }
}

// ---------------------------------------------------------------- the poster (state at time t)
function poster(t) {
  // grid: verticals then horizontals draw in a stagger; hairlines settle lighter once the poster locks
  g.lineWidth = 1;
  g.strokeStyle = `rgba(17,17,17,${lerp(0.16, 0.08, prog(t, FREEZE, FREEZE + 0.6))})`;
  for (let k = 1; k < 16; k++) {
    const p = io2(prog(t, 0.05 + k * 0.045, 0.6 + k * 0.045)); if (!p) continue;
    g.beginPath(); g.moveTo(k * M + 0.5, 0); g.lineTo(k * M + 0.5, H * p); g.stroke();
  }
  for (let j = 1; j < 9; j++) {
    const p = io2(prog(t, 0.25 + j * 0.06, 0.85 + j * 0.06)); if (!p) continue;
    g.beginPath(); g.moveTo(0, j * M + 0.5); g.lineTo(W * p, j * M + 0.5); g.stroke();
  }
  // crop marks
  if (t >= T.marks) {
    g.strokeStyle = COL.ink; g.lineWidth = 2;
    for (const [x, y, sx, sy] of [[40, 40, 1, 1], [W - 40, 40, -1, 1], [40, H - 40, 1, -1], [W - 40, H - 40, -1, -1]]) {
      g.beginPath(); g.moveTo(x, y + sy * 30); g.lineTo(x, y); g.lineTo(x + sx * 30, y); g.stroke();
    }
  }

  // C blue bar slides in from the left (7 modules of travel)
  if (t > T.bar - 0.45) fill(COL.blue, () => g.rect(lerp(-6 * M, 1 * M, act(t, T.bar, 0.45)), 6 * M, 5 * M, M));
  // B yellow quarter turns 90° about its corner pivot (6,1)
  if (t > T.sector - 0.45) {
    const r = 3 * M * io2(prog(t, T.sector - 0.45, T.sector - 0.3));
    fill(COL.yel, sector(6 * M, 1 * M, r, lerp(-Math.PI / 2, 0, act(t, T.sector))));
  }
  // A red circle falls and lands dead (power2.in), centre (4,4), r = 2 modules
  fill(COL.red, circle(4 * M, lerp(-0.5 * M, 4 * M, in2(prog(t, 0, T.circle))), 2 * M));
  // D black triangle flips open about its right edge
  if (t > T.triangle - 0.4) {
    const sx = act(t, T.triangle);
    g.save(); g.translate(9 * M, 0); g.scale(sx, 1); g.translate(-9 * M, 0);
    fill(COL.ink, () => { g.moveTo(6 * M, 7 * M); g.lineTo(9 * M, 7 * M); g.lineTo(9 * M, 4 * M); g.closePath(); });
    g.restore();
  }
  // E black block wipes in, then splits: right half travels one module
  if (t > T.block - 0.15) {
    const h = M * io2(prog(t, T.block - 0.15, T.block));
    const x2 = lerp(2 * M, 3 * M, act(t, T.split, 0.3));
    fill(COL.ink, () => { g.rect(1 * M, 8 * M - h, M, h); g.rect(x2, 8 * M - h, M, h); });
  }
  // F red semicircle rises two modules from below the frame onto the triangle's base line
  if (t > T.semi - 0.4) fill(COL.red, semi(8 * M, lerp(10 * M, 8 * M, act(t, T.semi)), M));
  // H small blue dot grows on its module
  if (t > T.dot - 0.25) fill(COL.blue, circle(5.5 * M, 7.5 * M, 0.5 * M * act(t, T.dot, 0.25)));
  // G vertical rule divides image | type
  if (t > T.rule - 0.4) fill(COL.ink, () => g.rect(10 * M - 2, M, 4, 7 * M * act(t, T.rule)));

  // type: IMAGINARIUM set vertically, reading upward, wiped in from the bottom
  if (t > T.title - 0.4) {
    const p = act(t, T.title);
    g.save();
    g.beginPath(); g.rect(13 * M, 8 * M - 7 * M * p, 2 * M, 7 * M * p + 2); g.clip();
    g.translate(15 * M, 8 * M); g.rotate(-Math.PI / 2);
    g.font = `900 ${titleFit.size}px "Inter Display"`; g.fillStyle = COL.ink; g.textBaseline = 'alphabetic';
    spaced(TITLE, titleFit.left, 0, titleFit.track);
    g.restore();
  }
  // red quarter turns into the type column, pivot (11,5)
  if (t > T.redsector - 0.45) {
    const r = 2 * M * io2(prog(t, T.redsector - 0.45, T.redsector - 0.3));
    fill(COL.red, sector(11 * M, 5 * M, r, lerp(-Math.PI, -Math.PI / 2, act(t, T.redsector))));
  }
  // FOUNDRY block slides in from the right edge
  if (t > T.foundry - 0.45) {
    const x = lerp(16 * M, 11 * M, act(t, T.foundry, 0.45));
    fill(COL.ink, () => g.rect(x, 6 * M, 3 * M - 8, M));
    g.font = '900 52px "Inter Display"'; g.fillStyle = COL.paper; g.textBaseline = 'middle';
    spaced('FOUNDRY', x + 22, 6.5 * M + 2, 4);
  }
  // small caps captions
  const cap = act(t, T.redsector, 0.3);
  if (cap > 0) {
    g.globalAlpha = cap; g.fillStyle = COL.ink; g.textBaseline = 'alphabetic';
    g.font = '600 17px "Inter"'; spaced('IDEA · SYSTEM · PRODUCT', 11 * M, 7 * M + 46, 3.4);
    g.font = '600 15px "Inter"'; spaced('CREATIVE OPERATING SYSTEM', 11 * M, 1 * M + 34, 3);
    g.font = '900 15px "Inter"'; spaced('N° 01', 11 * M, 1 * M + 60, 3);
    g.globalAlpha = 1;
  }

  // the locked poster's living detail: a clock hand in the red circle ticks once per beat
  if (t >= FREEZE) {
    const k = (t - FREEZE) / 0.5, step = Math.floor(k) + io2(clamp((k % 1) / 0.25));
    const a = -Math.PI / 2 + step * Math.PI / 4;
    g.save(); g.translate(4 * M, 4 * M); g.rotate(a);
    fill(COL.paper, () => g.rect(-4, -4, 1.6 * M, 8));
    g.restore();
    fill(COL.paper, circle(4 * M, 4 * M, 10));
  }
}

// ---------------------------------------------------------------- hero: tile cascade 6-8 s
const PAL = [COL.red, COL.yel, COL.blue, COL.ink, COL.paper];
const TILES = [];
{
  const r = rng(42);
  for (let j = 0; j < 9; j++) for (let i = 0; i < 16; i++) {
    const a = Math.floor(r() * 5); let b = Math.floor(r() * 4); if (b >= a) b++;
    TILES.push({ i, j, bg: PAL[a], fg: PAL[b], rot0: Math.floor(r() * 4), d: Math.hypot(i + 0.5 - 8, j + 0.5 - 4.5) });
  }
}
const DMAX = Math.max(...TILES.map(o => o.d));
function cascade(t) {
  if (t < DROP || t > FREEZE) return;
  for (const o of TILES) {
    const sIn = io2(prog(t, DROP + o.d * 0.04, DROP + o.d * 0.04 + 0.18));
    const t0 = FREEZE - 0.55 + (DMAX - o.d) * 0.04;           // collapse edges-in, centre last, all gone by the lock
    const s = sIn * (1 - io2(prog(t, t0, t0 + 0.15)));
    if (s <= 0) continue;
    let rot = o.rot0;
    for (const b of [6.5, 7.0]) rot += io2(prog(t, b - 0.25 + o.d * 0.02, b + o.d * 0.02));
    const cx = o.i * M + M / 2, cy = o.j * M + M / 2;
    g.save(); g.translate(cx, cy); g.scale(s, s);
    g.fillStyle = o.bg; g.fillRect(-M / 2, -M / 2, M, M);
    g.beginPath(); g.rect(-M / 2, -M / 2, M, M); g.clip();     // tile stays square on the grid; only its quarter turns
    g.rotate(rot * Math.PI / 2);
    fill(o.fg, sector(-M / 2, -M / 2, M, 0));
    g.restore();
  }
}

window.renderAt = async (t) => {
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = COL.paper; g.fillRect(0, 0, W, H);
  poster(t);
  cascade(t);
  g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.18;
  g.drawImage(grain, 0, 0);
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
};
await window.renderAt(0);
window.__ready = true;
