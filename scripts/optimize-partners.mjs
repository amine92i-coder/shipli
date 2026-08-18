/**
 * Re-encodes the partner logos from the pristine masters in assets-src/partners/
 * into the size the marquee actually paints, and writes the result to
 * public/images/partners/.
 *
 * Run it with `node scripts/optimize-partners.mjs`. Like optimize-hero.mjs it
 * only reads from assets-src, so it is safe to re-run: the masters are never
 * touched, and re-running does not compound JPEG loss the way re-encoding
 * public/ in place would.
 *
 * WHY THESE BECOME JPEG
 * The masters are 1024x1024 RGBA PNGs, 317-607 KB apiece. Two things made them
 * that heavy, and neither is load-bearing:
 *  - Every one of them is fully opaque. The alpha channel is present but every
 *    pixel is 255, and the 10px border of every image is white (darkest channel
 *    247). They are logos sitting on a white field, not cut-outs, and the strip
 *    they render in is bg-white — so an opaque format shows the same pixels.
 *  - The "white" is not flat: it dithers between 253 and 255. That noise is
 *    invisible but it defeats PNG's row filters, which is why a flat logo costs
 *    half a megabyte. JPEG's DCT drops it for free.
 * They also each carried a ~19-28 KB `caBX` chunk (Apple metadata, no pixels);
 * sips drops it on re-encode.
 *
 * HOW THE TARGET WAS CHOSEN
 * Partners.tsx draws each logo at `h-24 w-auto ... sm:h-28 lg:h-32`, so the box
 * is 96px, then 112px, and settles at 128px on large screens. The masters are
 * square and `w-auto` follows the height, so 128px is the widest they are ever
 * painted. `hover:scale-105` takes that to 134px.
 *
 * DPI_FACTOR is 3 here where the hero script uses 2.5, for two reasons. These
 * are hard-edged marks with lettering rather than soft scene art, so they show
 * resampling sooner; and 3 also covers the one case the desktop box misses, a
 * dpr-3 phone drawing the h-24 box at 288 device pixels. Measuring it agreed:
 * rendering each candidate to the 256 device pixels the strip actually paints
 * and comparing mean luma gradient against the master, 336px held 95% of the
 * master's edge energy but dropped to 87% on partner-3, 400px held 97% with a
 * 95% worst case, and 512px only reached 98% for another 44 KB. 400 is the knee.
 *
 * ON QUALITY
 * sips writes 4:2:0 JPEG at every quality below 100 (verified by reading the
 * SOF sampling factors), so chroma always lands at half the encode size and no
 * quality setting changes that. What that costs is measurable: against a
 * lossless resample of the same master, luma RMSE at q78 is ~1 with a worst
 * pixel of 22, while chroma RMSE is ~3. Luma is what carries perceived
 * sharpness, so the logos stay crisp; the error is a faint chroma spread on
 * saturated edges, well under a device pixel once the browser scales 336px down
 * to 128. Quality is 78 because that is where the curve flattens — every file
 * gains under 0.5 dB PSNR between q78 and q92 while costing ~20% more bytes.
 *
 * The masters keep their aspect ratio and their framing. The logos are centred
 * in a square canvas with white padding, and that padding is part of what sets
 * their on-screen size, so cropping it would silently resize them in the strip.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, statSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'assets-src/partners';
const OUT = 'public/images/partners';

/** Tallest box the marquee ever draws a logo in (lg:h-32), times hover:scale-105. */
const BOX = 128 * 1.05;
/** Retina headroom. Higher than the hero's 2.5; see the note above. */
const DPI_FACTOR = 3;
const TARGET = Math.round(BOX * DPI_FACTOR);

/** Where the PSNR curve flattens for this set; see the note above. */
const QUALITY = 78;

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
  if (!file.endsWith('.png')) continue;

  const src = join(SRC, file);
  const stem = file.replace(/\.png$/, '');
  const out = join(OUT, `${stem}.jpg`);

  const from = dims(src);
  const fromKb = kb(src);
  before += fromKb;

  const longest = Math.max(from.w, from.h);
  // Never upscale: a master smaller than its target is already the limit.
  const clamp = Math.min(TARGET, longest);

  copyFileSync(src, out);
  if (clamp < longest) sips(['-Z', String(clamp), out]);
  sips(['-s', 'format', 'jpeg', '-s', 'formatOptions', String(QUALITY), out]);

  // The PNG this replaces would otherwise keep shipping: Vite copies public/
  // into dist/ verbatim, so a leftover would cost its full size for nothing.
  const stale = join(OUT, file);
  if (existsSync(stale)) rmSync(stale);

  const to = dims(out);
  const toKb = kb(out);
  after += toKb;
  rows.push({
    file: `${file} -> ${stem}.jpg`,
    from: `${from.w}x${from.h}`,
    to: `${to.w}x${to.h}`,
    kb: `${fromKb} -> ${toKb}`,
    saved: fromKb ? `${Math.round((1 - toKb / fromKb) * 100)}%` : '',
  });
}

console.table(rows);
console.log(`partner payload ${before} KB -> ${after} KB  (${Math.round((1 - after / before) * 100)}% smaller)`);
