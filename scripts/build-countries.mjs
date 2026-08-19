/**
 * Generates src/data/countries.ts — the two landmasses for the hero scene.
 *
 * The hero shows exactly two countries and open water. Because no other land is
 * in frame there is no reference to give the composition away, so we do NOT lay
 * the two out on a shared world projection. Each country gets its own placement
 * (scale + offset) inside the viewBox. That is the whole point: on a true
 * projection Morocco and China sit 129° apart and the scene is forced into a
 * ~3.7:1 letterbox, which is exactly what made the previous map hero crowd the
 * copy. Placing them independently buys a 16:9 frame with room to breathe.
 *
 *   node scripts/build-countries.mjs
 *
 * Source: naturalearthdata.com, ne_110m_admin_0_countries (public domain).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Two composition frames, because one cannot serve both.
 *
 * The wide frame is 16:9 and puts the countries on opposite corners of the free
 * diagonal. Rendered into a portrait phone at preserveAspectRatio="meet" that
 * frame has to fit by WIDTH, so a 1600x900 scene becomes a ~220px letterboxed
 * band across the bottom of an 844px section: both countries shrink to about
 * 100px and the port labels stop being readable. Cropping instead of fitting is
 * not an option either — the two subjects sit at opposite corners, so no
 * portrait sub-rectangle of the wide frame contains both.
 *
 * So portrait gets its own placement: the same silhouettes, restacked into a
 * near-vertical lane and scaled up, sized to the roughly 280px of clear height a
 * phone actually has beneath the headline.
 */
/**
 * Both frames are DELIBERATELY SHORTER than the section they sit in was.
 *
 * The scene renders at preserveAspectRatio="meet", so its on-screen scale is
 * min(sectionW / frameW, sectionH / frameH). The hero is no longer 100svh, and
 * a 16:9 frame inside a 2.1:1 section fits by HEIGHT — which would have shrunk
 * every landmass by ~16% at the exact moment we were asked to enlarge them.
 * Matching the frame's aspect to the shorter section's is what buys the scale
 * back; the country `scale` bumps below are then a real gain on top of it.
 */
const VIEWS = {
  wide: { width: 1600, height: 780 },
  tall: { width: 900, height: 1320 },
};

/**
 * Morocco is drawn as ONE landmass. Natural Earth ships Western Sahara as a
 * separate "Indeterminate" polygon; a Moroccan company's site shows the country
 * whole, so both features are rasterised into the same silhouette.
 *
 * Taiwan is likewise its own Natural Earth feature and is simply not drawn —
 * consistent with Spain, Algeria and every other country that is absent here.
 * Only the two countries in the story appear.
 */
const SUBJECTS = {
  // WIDE: the two sit on the frame's free diagonal — China top-right, Morocco
  // bottom-centre-left — because the headline block owns the upper-left and
  // measures roughly x[142,782] y[220,690] of this viewBox. That diagonal is
  // also the longest run available, which buys the most open water between them.
  //
  // TALL: the headline is full-bleed on a phone and leaves only about 200px —
  // roughly 460 of these units — clear beneath it. Stacking the two countries
  // needs more than 460 units for the landmasses alone, so they go SIDE BY SIDE
  // instead: the band then only has to be as tall as the taller of the two, and
  // the lane still runs west-to-east between them, which is the same reading as
  // the wide frame. China keeps the right and Morocco the left, so the mental
  // map survives the reflow.
  morocco: {
    names: ['Morocco', 'W. Sahara'],
    // Scaled up relative to China: honest relative area would render Morocco
    // four times smaller and read as an afterthought, and with no other land in
    // frame there is nothing to contradict it. Pushed further still in portrait,
    // where honest scaling would leave it about 40px wide on a phone.
    //
    // WIDE cy is what pins Morocco's SOUTH edge near the frame's bottom while
    // its north coast clears the copy block. The copy no longer floats with the
    // section height — it is pinned under the header — so the one number that
    // has to hold is Morocco's box TOP, at 507 of 780 here. Its south edge lands
    // at 773, seven units off the frame's bottom, which is the real ceiling on
    // this scale: the next step up runs Western Sahara off the frame.
    wide: { scale: 18, cx: 542, cy: 640 },
    tall: { scale: 15.5, cx: 138, cy: 1158 },
    port: { lon: -7.62, lat: 33.59, name: 'Casablanca' },
  },
  china: {
    names: ['China'],
    // Deliberately the one country that got SMALLER. Morocco is the client's
    // country and was reading as the junior partner at four times less area; the
    // two were moved toward each other from both ends rather than by inflating
    // Morocco alone, which at these scales would have run it off the frame.
    //
    // The wide box goes 540x365 -> 481x325 and its south coast lifts to y372 of
    // 780. That is also what opens the pocket of water south-east of China that
    // both thought bubbles now sit in — see WIDE_SPEC.thoughts in
    // CrossingScene.tsx, and re-run scripts/bubble-fit.mjs if this moves.
    wide: { scale: 9.8, cx: 1300, cy: 210 },
    // Portrait keeps the two side by side rather than stacked, so China's
    // budget is width, not height. The floating WhatsApp button owns the
    // bottom-right corner of every page, which used to force China left to keep
    // NINGBO's label clear; with the labels gone only a small dot is at risk, so
    // China can take the width the composition actually wants.
    tall: { scale: 6.3, cx: 676, cy: 1120 },
    port: { lon: 121.55, lat: 29.87, name: 'Ningbo' },
  },
};

/** Drop specks — islands below this share of the subject's largest ring. */
const MIN_RING_SHARE = 0.02;

const geo = JSON.parse(readFileSync(join(here, 'ne_110m_admin_0_countries.geojson'), 'utf8'));

const ringArea = (ring) => {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a / 2);
};

function collect(names) {
  const rings = [];
  for (const feature of geo.features) {
    const p = feature.properties;
    if (!names.includes(p.NAME) && !names.includes(p.ADMIN)) continue;
    const { type, coordinates } = feature.geometry;
    const parts = type === 'Polygon' ? [coordinates] : coordinates;
    for (const poly of parts) rings.push(poly[0]); // outer ring only
  }
  if (!rings.length) throw new Error(`no features matched ${names.join(', ')}`);

  const biggest = Math.max(...rings.map(ringArea));
  return rings.filter((r) => ringArea(r) / biggest >= MIN_RING_SHARE);
}

const out = {};

for (const [key, subject] of Object.entries(SUBJECTS)) {
  const rings = collect(subject.names);

  // Combined bbox across every kept ring, so the two Morocco features share one
  // transform and stay welded together.
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }

  const midLon = (minLon + maxLon) / 2;
  const midLat = (minLat + maxLat) / 2;
  const r = (n) => Math.round(n * 10) / 10;

  // Both frames reuse the same rings — only the placement differs, so the two
  // layouts can never drift into showing subtly different coastlines.
  for (const frame of Object.keys(VIEWS)) {
    const { scale, cx, cy } = subject[frame];

    // Equirectangular about the subject's own centre, then dropped at cx/cy.
    // cos(midLat) keeps the shape from stretching horizontally the way a naive
    // lon×scale would — Morocco at 28°N would come out ~13% too wide.
    const kx = scale * Math.cos((midLat * Math.PI) / 180);
    const px = (lon) => cx + (lon - midLon) * kx;
    const py = (lat) => cy - (lat - midLat) * scale;

    const paths = rings.map(
      (ring) => ring.map(([lon, lat], i) => `${i ? 'L' : 'M'}${r(px(lon))},${r(py(lat))}`).join('') + 'Z',
    );

    // The bbox is emitted, not hand-copied into the component: the painted plate
    // behind each country is positioned from it, and a retuned `scale`/`cx`/`cy`
    // used to move the outline while leaving the plate behind, clipping a
    // country half empty.
    const xs = rings.flatMap((ring) => ring.map(([lon]) => px(lon)));
    const ys = rings.flatMap((ring) => ring.map(([, lat]) => py(lat)));

    (out[frame] ??= {})[key] = {
      path: paths.join(''),
      port: { x: r(px(subject.port.lon)), y: r(py(subject.port.lat)), name: subject.port.name },
      box: {
        x: r(Math.min(...xs)),
        y: r(Math.min(...ys)),
        w: r(Math.max(...xs) - Math.min(...xs)),
        h: r(Math.max(...ys) - Math.min(...ys)),
      },
      rings: rings.length,
      points: rings.reduce((n, ring) => n + ring.length, 0),
    };
  }
}

const country = (c) => JSON.stringify({ path: c.path, port: c.port, box: c.box });

const ts = `// GENERATED by scripts/build-countries.mjs — do not edit by hand.
// Silhouettes from Natural Earth 110m admin-0 (public domain).
// Morocco includes Western Sahara as a single landmass.

/** Port anchor inside a scene's viewBox. */
export type Port = { x: number; y: number; name: string };
/** Silhouette bounds — the painted plate behind a country is sized from these. */
export type Box = { x: number; y: number; w: number; h: number };
export type Country = { path: string; port: Port; box: Box };
export type Scene = { width: number; height: number; morocco: Country; china: Country };

/**
 * The hero scene, in two frames. Same silhouettes, different placement — see
 * scripts/build-countries.mjs for why portrait cannot reuse the wide layout.
 */
export const WIDE: Scene = {
  width: ${VIEWS.wide.width},
  height: ${VIEWS.wide.height},
  morocco: ${country(out.wide.morocco)},
  china: ${country(out.wide.china)},
};

export const TALL: Scene = {
  width: ${VIEWS.tall.width},
  height: ${VIEWS.tall.height},
  morocco: ${country(out.tall.morocco)},
  china: ${country(out.tall.china)},
};
`;

writeFileSync(join(here, '..', 'src', 'data', 'countries.ts'), ts);
console.log(
  `morocco ${out.wide.morocco.rings} rings/${out.wide.morocco.points} pts · china ${out.wide.china.rings} rings/${out.wide.china.points} pts · ${(ts.length / 1024).toFixed(1)} kB`,
);
for (const frame of Object.keys(VIEWS)) {
  const f = out[frame];
  console.log(
    `${frame.padEnd(5)} ${VIEWS[frame].width}x${VIEWS[frame].height}` +
      ` · morocco box ${JSON.stringify(f.morocco.box)} port ${f.morocco.port.x},${f.morocco.port.y}` +
      ` · china box ${JSON.stringify(f.china.box)} port ${f.china.port.x},${f.china.port.y}`,
  );
}
