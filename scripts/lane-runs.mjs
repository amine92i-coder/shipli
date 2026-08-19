/**
 * Reports, per frame and per lane: total arc length, and the stretches of the
 * lane that pass over land.
 *
 *   node scripts/lane-runs.mjs
 *
 * The `run` clamps in CrossingScene.tsx exist because both lane endpoints are
 * real coastal coordinates that land INSIDE their country's silhouette, so a
 * craft driven across the full 0..1 finishes inland. Every time the countries
 * are rescaled those crossings move, and the clamps have to be re-derived rather
 * than assumed. This prints the numbers that go in the comment above `run`.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'data', 'countries.ts'), 'utf8');

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

function scene(name) {
  const body = src.slice(src.indexOf(`export const ${name}: Scene = {`));
  const paths = [...body.matchAll(/"path":"([^"]+)"/g)].map((m) => m[1]);
  const ports = [...body.matchAll(/"port":(\{[^}]+\})/g)].map((m) => JSON.parse(m[1]));
  return {
    morocco: { rings: rings(paths[0]), port: ports[0] },
    china: { rings: rings(paths[1]), port: ports[1] },
  };
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

const cubic = (p, t) => {
  const u = 1 - t;
  return [
    u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
  ];
};

/**
 * Walks the curve at even PARAMETER steps but reports positions as fractions of
 * ARC LENGTH, because that is what SVGPathElement.getPointAtLength — and so the
 * scene's place() — actually uses. On these curves the two differ by enough to
 * matter: the parameter crawls through the tight turn out of the port.
 */
function analyse(label, ctl, sc, hull) {
  const N = 2000;
  const pts = [];
  const cum = [0];
  for (let i = 0; i <= N; i++) pts.push(cubic(ctl, i / N));
  for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[N];

  const spans = [];
  let open = null;
  for (let i = 0; i <= N; i++) {
    const over =
      (inRings(sc.china.rings, pts[i][0], pts[i][1]) && 'china') ||
      (inRings(sc.morocco.rings, pts[i][0], pts[i][1]) && 'morocco') ||
      null;
    if (over && !open) open = { over, from: cum[i] / total };
    if ((!over || over !== open?.over) && open) {
      spans.push(`${open.over} ${open.from.toFixed(2)}..${(cum[i] / total).toFixed(2)}`);
      open = over ? { over, from: cum[i] / total } : null;
    }
  }
  if (open) spans.push(`${open.over} ${open.from.toFixed(2)}..1.00`);

  console.log(
    `${label.padEnd(9)} length ${total.toFixed(0).padStart(5)}` +
      ` · hull ${hull} = ${((hull / total) * 100).toFixed(0)}% of lane` +
      ` · half-hull ${(hull / 2 / total).toFixed(3)}` +
      ` · over land: ${spans.join(', ') || 'none'}`,
  );
}

const WIDE = scene('WIDE');
const TALL = scene('TALL');
const w = (a, b) => [[WIDE.china.port.x, WIDE.china.port.y], a, b, [WIDE.morocco.port.x, WIDE.morocco.port.y]];
const t = (a, b) => [[TALL.china.port.x, TALL.china.port.y], a, b, [TALL.morocco.port.x, TALL.morocco.port.y]];

analyse('wide sea', w([1330, 610], [980, 720]), WIDE, 194);
analyse('wide air', w([1240, 400], [860, 430]), WIDE, 110);
analyse('tall sea', t([700, 1300], [340, 1300]), TALL, 202);
analyse('tall air', t([640, 1060], [340, 1010]), TALL, 98);
