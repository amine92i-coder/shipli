/**
 * Re-encodes the hero scene art from the pristine Higgsfield masters in
 * assets-src/hero/ into the sizes the page actually paints, and writes the
 * result to public/images/hero/.
 *
 * Run it with `node scripts/optimize-hero.mjs`. It only reads from assets-src,
 * so it is safe to re-run: the masters are never touched, and re-running does
 * not compound JPEG loss the way re-encoding public/ in place would.
 *
 * WHY THE MASTERS LIVE OUTSIDE public/
 * Anything under public/ is copied verbatim into dist/ by Vite, so a 1200px
 * master would ship at 1200px even though nothing ever draws it that big.
 * assets-src/ is outside that copy, so it can hold full-resolution art without
 * putting it on the CDN.
 *
 * HOW THE TARGETS WERE CHOSEN
 * Every prop is drawn into a fixed box in the scene's viewBox (see
 * CrossingScene's WIDE_SPEC / TALL_SPEC), so its on-screen size is
 *
 *     box_in_viewBox_units x scale,  scale = min(vw / 1600, vh / 900)
 *
 * for the wide frame. scale is 1.2 on a 1920x1080 window and 1.08 on a 16"
 * MacBook at its default scaling. Targets below are the largest box the prop
 * occupies in either frame, times DPI_FACTOR — enough to stay sharp on a
 * retina panel at a normal window size, without paying for a 5K one.
 *
 * Two of these are deliberately NOT reduced:
 *  - ocean is full-bleed with object-cover, so its size is set by the viewport
 *    rather than by a viewBox box. 1920 is the usual ceiling; it is a defocused
 *    seascape behind a scrim, so upscaling on a wider monitor does not read.
 *  - ship is already close to its target, so resizing would only resample it.
 *
 * The PNGs keep their alpha and their aspect ratio, so the art stays in the
 * same place inside its box and the SVG geometry is untouched. That matters
 * for ship and plane in particular: they are rotated about the centre of their
 * box, so changing where the art sits inside the canvas would throw off their
 * heading.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'assets-src/hero';
const OUT = 'public/images/hero';

/** Retina headroom over the largest box a prop is ever drawn into. */
const DPI_FACTOR = 2.5;

/**
 * `box` is the widest the prop is drawn in either frame, in viewBox units.
 * `max` overrides the computed target where something other than the box
 * governs. `q` is the JPEG quality; PNGs are lossless, so for them the only
 * lever is resolution.
 */
const PLAN = {
  // Quality is low because this one can afford it: it is defocused water read
  // through a dark scrim, so there is no fine detail to protect. Measured on
  // the master, the curve is 475 KB at the source, 435 at q68, 296 at q55, 223
  // at q45 — q68 buys almost nothing, and the cliff is well below where the
  // scrim would let banding show.
  'ocean.jpg': { max: 1920, q: 48, note: 'full-bleed, object-cover — viewport-sized, not box-sized' },
  // Same idea, less headroom: this one is textured terrain the eye can land on,
  // so it keeps more quality than the ocean does. 201 KB at q72 vs 160 at q60.
  // Both plates are now blended in soft-light over the country's flag rather
  // than painted opaque, which also hides compression noise — the flag under
  // them is what sets the colour.
  'land-china.jpg': { box: 540, q: 58, note: 'China plate, widest in the wide frame' },
  // Already small once resized to its box; no reason to push quality.
  'land-morocco.jpg': { box: 224, q: 72, note: 'Morocco plate' },
  'port.png': { box: 170 },
  'crates.png': { box: 146, note: 'container stack on the Chinese quay' },
  'docs.png': { box: 126 },
  // These three are drawn into boxes that are taller than they are wide, and
  // `box` is the longest side of the box because that is what `sips -Z` clamps.
  'cartons.png': { box: 94, note: 'carton pile — height governs' },
  'plane.png': { box: 110, note: 'height governs' },
  'ship.png': { max: 400, note: 'target is 485; the master is only 400 — copied through' },
};

const sips = (args) => execFileSync('sips', args, { stdio: ['ignore', 'pipe', 'pipe'] });
const dims = (f) => {
  const out = sips(['-g', 'pixelWidth', '-g', 'pixelHeight', f]).toString();
  return {
    w: +out.match(/pixelWidth:\s*(\d+)/)[1],
    h: +out.match(/pixelHeight:\s*(\d+)/)[1],
  };
};
const kb = (f) => Math.round(statSync(f).size / 1024);

mkdirSync(OUT, { recursive: true });

let before = 0;
let after = 0;
const rows = [];

for (const file of readdirSync(SRC).sort()) {
  const src = join(SRC, file);
  const out = join(OUT, file);
  const plan = PLAN[file];
  if (!plan) {
    console.warn(`  ! no plan for ${file} — copied through`);
    copyFileSync(src, out);
    continue;
  }

  const from = dims(src);
  const fromKb = kb(src);
  before += fromKb;

  // Longest side, since that is what `sips -Z` clamps.
  const target = plan.max ?? Math.max(Math.round(plan.box * DPI_FACTOR), plan.minSide ?? 0);
  const longest = Math.max(from.w, from.h);
  // Never upscale: a master smaller than its target is already the limit.
  const clamp = Math.min(target, longest);

  copyFileSync(src, out);
  if (clamp < longest) sips(['-Z', String(clamp), out]);
  if (plan.q) sips(['-s', 'format', 'jpeg', '-s', 'formatOptions', String(plan.q), out]);

  const to = dims(out);
  const toKb = kb(out);
  after += toKb;
  rows.push({
    file,
    from: `${from.w}x${from.h}`,
    to: `${to.w}x${to.h}`,
    kb: `${fromKb} -> ${toKb}`,
    saved: fromKb ? `${Math.round((1 - toKb / fromKb) * 100)}%` : '',
    note: plan.note ?? '',
  });
}

console.table(rows);
console.log(`hero payload ${before} KB -> ${after} KB  (${Math.round((1 - after / before) * 100)}% smaller)`);
