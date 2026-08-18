/**
 * Where can a flag emblem sit inside a country without being clipped?
 *
 * The flags are drawn as a solid field clipped to the silhouette plus an emblem
 * placed on top — the five-star arc for China, the interlaced pentagram for
 * Morocco. Mapping a 3:2 flag onto a country's bounding box does not work: the
 * canton lands on the top-left CORNER of the box, and neither country has land
 * there (China's northernmost point is in the far north-EAST, Morocco is a
 * diagonal sliver). The emblem has to be placed against the silhouette itself.
 *
 * So: sample a grid, keep the points inside the polygon, and score each by its
 * distance to the nearest edge. The winner is the deepest point in the country —
 * the largest circle that fits inside it — which is exactly the constraint an
 * emblem has.
 *
 *   node scripts/emblem-anchors.mjs
 *
 * Output is advisory. It goes into CrossingScene's per-frame `emblem` spec by
 * hand, because the deepest point is not always the best-LOOKING one and the
 * final call is compositional.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// countries.ts is TypeScript, so it cannot just be imported. It is generated
// with each country as a single JSON literal on one line, which is exactly what
// makes it safe to lift back out with a regex here.
const src = readFileSync(join(here, '..', 'src', 'data', 'countries.ts'), 'utf8');
const grab = (frame, key) => {
  const after = src.slice(src.indexOf(`export const ${frame}:`));
  const line = after.match(new RegExp(`\\n  ${key}: (\\{.*\\}),`));
  if (!line) throw new Error(`could not find ${frame}.${key}`);
  return JSON.parse(line[1]);
};
const WIDE = { china: grab('WIDE', 'china'), morocco: grab('WIDE', 'morocco') };
const TALL = { china: grab('TALL', 'china'), morocco: grab('TALL', 'morocco') };

const SAMPLES = 320;

/** Every ring in a path, as arrays of [x,y]. Paths here are M/L/Z only. */
function rings(d) {
  return d
    .split('Z')
    .filter((s) => s.trim())
    .map((sub) =>
      sub
        .replace(/^M/, '')
        .split('L')
        .map((p) => p.replace(/^M/, '').split(',').map(Number)),
    );
}

/** Even-odd across every ring, so Morocco's two features count as one solid. */
function inside(rs, x, y) {
  let hit = false;
  for (const ring of rs) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
  }
  return hit;
}

function edgeDist(rs, x, y) {
  let best = Infinity;
  for (const ring of rs) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      const dx = xj - xi;
      const dy = yj - yi;
      const t = Math.max(0, Math.min(1, ((x - xi) * dx + (y - yi) * dy) / (dx * dx + dy * dy || 1)));
      best = Math.min(best, Math.hypot(x - (xi + t * dx), y - (yi + t * dy)));
    }
  }
  return best;
}

for (const [frameName, scene] of [
  ['wide', WIDE],
  ['tall', TALL],
]) {
  for (const key of ['china', 'morocco']) {
    const { path, box } = scene[key];
    const rs = rings(path);
    let best = { r: -1 };
    for (let i = 0; i <= SAMPLES; i++) {
      for (let j = 0; j <= SAMPLES; j++) {
        const x = box.x + (box.w * i) / SAMPLES;
        const y = box.y + (box.h * j) / SAMPLES;
        if (!inside(rs, x, y)) continue;
        const r = edgeDist(rs, x, y);
        if (r > best.r) best = { x, y, r };
      }
    }
    console.log(
      `${frameName.padEnd(5)} ${key.padEnd(8)} deepest point ${best.x.toFixed(1)},${best.y.toFixed(1)}` +
        `  clearance ${best.r.toFixed(1)}  (box ${box.w.toFixed(0)}x${box.h.toFixed(0)})`,
    );
  }
}
