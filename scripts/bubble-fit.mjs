/**
 * Checks candidate thought-bubble rectangles against the scene they sit in.
 *
 *   node scripts/bubble-fit.mjs
 *
 * The bubbles are the one element in the hero placed purely by eye — the
 * countries come from a projection and the craft ride the lanes, but a bubble is
 * just a rectangle someone chose. This reports, for each candidate, how close it
 * comes to the two landmasses, the two lanes and the frame edge, so "it looks
 * clear" can be replaced with a number.
 *
 * Distances are in viewBox units of the frame being checked.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'data', 'countries.ts'), 'utf8');

/** Pull one scene's literal out of the generated module. */
function scene(name) {
  const body = src.slice(src.indexOf(`export const ${name}: Scene = {`));
  const grab = (key) => {
    const at = body.indexOf(`"${key}"`);
    return JSON.parse(body.slice(body.indexOf('{', at), body.indexOf('}', at) + 1));
  };
  const width = Number(/width: (\d+)/.exec(body)[1]);
  const height = Number(/height: (\d+)/.exec(body)[1]);
  const paths = [...body.matchAll(/"path":"([^"]+)"/g)].map((m) => m[1]);
  const ports = [...body.matchAll(/"port":(\{[^}]+\})/g)].map((m) => JSON.parse(m[1]));
  return {
    width,
    height,
    morocco: { rings: rings(paths[0]), port: ports[0] },
    china: { rings: rings(paths[1]), port: ports[1] },
  };
}

/** The generator emits nothing but M/L/Z, so this is all the parsing needed. */
const rings = (d) =>
  d
    .split('Z')
    .filter(Boolean)
    .map((sub) =>
      sub
        .split(/[ML]/)
        .filter(Boolean)
        .map((pt) => pt.split(',').map(Number)),
    );

const cubic = (p, t) => {
  const u = 1 - t;
  return [
    u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
  ];
};

/** Shortest distance from a point to a segment. */
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Rect sampled densely on its perimeter AND interior — a bubble that swallows a
 *  lane entirely would show zero perimeter intersections otherwise. */
function samples({ x, y, w, h }, step = 4) {
  const pts = [];
  for (let sx = x; sx <= x + w; sx += step) {
    for (let sy = y; sy <= y + h; sy += step) pts.push([sx, sy]);
  }
  return pts;
}

const inRings = (ringSet, px, py) => {
  let inside = false;
  for (const ring of ringSet) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
};

function report(label, sc, curves, rect) {
  const pts = samples(rect);
  let land = Infinity;
  let hitLand = 0;
  for (const [px, py] of pts) {
    for (const country of [sc.morocco, sc.china]) {
      if (inRings(country.rings, px, py)) hitLand++;
      for (const ring of country.rings) {
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const d = segDist(px, py, ring[j][0], ring[j][1], ring[i][0], ring[i][1]);
          if (d < land) land = d;
        }
      }
    }
  }

  const lane = {};
  for (const [name, p] of Object.entries(curves)) {
    let best = Infinity;
    let prev = cubic(p, 0);
    for (let i = 1; i <= 400; i++) {
      const cur = cubic(p, i / 400);
      for (const [px, py] of pts) {
        const d = segDist(px, py, prev[0], prev[1], cur[0], cur[1]);
        if (d < best) best = d;
      }
      prev = cur;
    }
    lane[name] = best;
  }

  const edge = Math.min(rect.x, rect.y, sc.width - (rect.x + rect.w), sc.height - (rect.y + rect.h));
  const r = (n) => (n === Infinity ? '-' : n.toFixed(0).padStart(4));
  console.log(
    `${label.padEnd(16)} rect ${rect.x},${rect.y} ${rect.w}x${rect.h}` +
      ` · land ${r(land)}${hitLand ? ` OVERLAP(${hitLand})` : ''}` +
      ` · sea ${r(lane.sea)} · air ${r(lane.air)} · edge ${r(edge)}`,
  );
}

const sq = (cx, cy, s) => ({ x: cx - s / 2, y: cy - s / 2, w: s, h: s });

const WIDE = scene('WIDE');
const TALL = scene('TALL');

const wideCurves = {
  sea: [[WIDE.china.port.x, WIDE.china.port.y], [1330, 610], [980, 720], [WIDE.morocco.port.x, WIDE.morocco.port.y]],
  air: [[WIDE.china.port.x, WIDE.china.port.y], [1240, 400], [860, 430], [WIDE.morocco.port.x, WIDE.morocco.port.y]],
};
const tallCtl = JSON.parse(process.env.TALL_CTL ?? '[[700,1300],[340,1300],[640,1060],[340,1010]]');
const tallCurves = {
  sea: [[TALL.china.port.x, TALL.china.port.y], tallCtl[0], tallCtl[1], [TALL.morocco.port.x, TALL.morocco.port.y]],
  air: [[TALL.china.port.x, TALL.china.port.y], tallCtl[2], tallCtl[3], [TALL.morocco.port.x, TALL.morocco.port.y]],
};

/** Worst clearance a rect has to anything — the number to maximise. */
function worst(sc, curves, rect) {
  const pts = samples(rect, 6);
  for (const [px, py] of pts) {
    for (const country of [sc.morocco, sc.china]) if (inRings(country.rings, px, py)) return -1;
  }
  let best = Math.min(rect.x, rect.y, sc.width - (rect.x + rect.w), sc.height - (rect.y + rect.h));
  for (const country of [sc.morocco, sc.china]) {
    for (const ring of country.rings) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        for (const [px, py] of pts) {
          const d = segDist(px, py, ring[j][0], ring[j][1], ring[i][0], ring[i][1]);
          if (d < best) best = d;
        }
      }
    }
  }
  for (const p of Object.values(curves)) {
    let prev = cubic(p, 0);
    for (let i = 1; i <= 300; i++) {
      const cur = cubic(p, i / 300);
      for (const [px, py] of pts) {
        const d = segDist(px, py, prev[0], prev[1], cur[0], cur[1]);
        if (d < best) best = d;
      }
      prev = cur;
    }
  }
  return best;
}

/** Coarse sweep for the roomiest centre at a given size, inside a bound. */
function sweep(sc, curves, size, [x0, x1], [y0, y1], step = 12) {
  const found = [];
  for (let cx = x0; cx <= x1; cx += step) {
    for (let cy = y0; cy <= y1; cy += step) {
      const w = worst(sc, curves, sq(cx, cy, size));
      if (w > 0) found.push({ cx, cy, w });
    }
  }
  return found.sort((a, b) => b.w - a.w);
}

const frames = { WIDE: [WIDE, wideCurves], TALL: [TALL, tallCurves] };

for (const [name, [sc, curves]] of Object.entries(frames)) {
  console.log(`${name} ${sc.width}x${sc.height}  china port ${sc.china.port.x},${sc.china.port.y}`);
  for (const [label, cx, cy, s] of JSON.parse(process.env[`${name}_CANDIDATES`] ?? '[]')) {
    report(label, sc, curves, sq(cx, cy, s));
  }
  const sw = process.env[`${name}_SWEEP`];
  if (sw) {
    const [size, x0, x1, y0, y1] = JSON.parse(sw);
    for (const hit of sweep(sc, curves, size, [x0, x1], [y0, y1]).slice(0, 12)) {
      console.log(`  sweep ${size}  centre ${hit.cx},${hit.cy}  worst ${hit.w.toFixed(0)}`);
    }
  }
}
