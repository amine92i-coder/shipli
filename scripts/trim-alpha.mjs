/**
 * Trims the transparent border off a cut-out PNG.
 *
 *   node scripts/trim-alpha.mjs assets-src/hero/crates.png [...]
 *
 * WHY THIS EXISTS
 * The scene places every prop into a box in the SVG's viewBox, and <image>
 * defaults to preserveAspectRatio="meet" — so the box has to match the ART's
 * aspect ratio, not the FILE's. A background remover returns the subject on the
 * generator's full canvas, which for a centred object is mostly empty pixels:
 * a 1024x1024 file whose boxes only occupy the middle 70% paints at 70% of the
 * size the box says, off-centre by however lopsided the padding is. The plane
 * in this scene sat in an 80x42 box and painted at 39x42 for exactly that
 * reason. Trimming to the alpha bounds makes the file's aspect the art's
 * aspect, so a box means what it says and the art is centred in it — which
 * matters most for anything that rotates about its own centre.
 *
 * HOW
 * Node ships zlib but no image codec, and this repo has no image dependency —
 * sips is the only tool on the machine (see the notes on it in memory). sips
 * can crop but cannot find the bounds, so this reads the alpha channel itself
 * (a PNG is chunks + a zlib stream + per-row filters, which is a page of code)
 * and then hands the numbers to sips to do the actual crop. Nothing here
 * re-encodes pixels: sips crops losslessly and the RGB is never touched.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

/** Alpha at or below this counts as background. Not 0: cut-outs leave a haze. */
const CUTOFF = 12;

const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

function alphaBounds(file) {
  const buf = readFileSync(file);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error(`${file} is not a PNG`);

  let width = 0;
  let height = 0;
  let channels = 0;
  let depth = 0;
  const idat = [];

  // Walk the chunk list: 4-byte length, 4-byte type, payload, 4-byte CRC.
  for (let p = 8; p < buf.length; ) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString('ascii', p + 4, p + 8);
    const body = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      depth = body[8];
      channels = CHANNELS[body[9]];
      if (body[12]) throw new Error(`${file}: interlaced PNGs are not handled`);
      if (depth !== 8) throw new Error(`${file}: only 8-bit PNGs are handled, got ${depth}`);
      if (channels !== 4 && channels !== 2) {
        throw new Error(`${file}: no alpha channel — nothing to trim`);
      }
    } else if (type === 'IDAT') idat.push(body);
    else if (type === 'IEND') break;
    p += 12 + len;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const bpp = channels; // 8-bit, so one byte per channel
  const stride = width * bpp;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  // Un-filter in place, one row at a time. Each row is prefixed with its filter
  // type and is defined against the row above, so this has to run start to end
  // even though only the alpha byte of each pixel is wanted.
  const line = Buffer.alloc(stride);
  const prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const at = y * (stride + 1);
    const filter = raw[at];
    raw.copy(line, 0, at + 1, at + 1 + stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? line[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      if (filter === 1) line[i] = (line[i] + a) & 255;
      else if (filter === 2) line[i] = (line[i] + b) & 255;
      else if (filter === 3) line[i] = (line[i] + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        // Paeth: whichever of left/up/up-left is closest to their linear estimate.
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        line[i] = (line[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
    }
    for (let x = 0; x < width; x++) {
      if (line[x * bpp + bpp - 1] <= CUTOFF) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    line.copy(prev);
  }

  if (maxX < 0) throw new Error(`${file}: fully transparent`);
  return { width, height, x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

for (const file of process.argv.slice(2)) {
  const b = alphaBounds(file);
  const same = b.w === b.width && b.h === b.height;
  if (!same) {
    // sips takes the crop size first and the top-left offset second.
    execFileSync('sips', ['-c', String(b.h), String(b.w), '--cropOffset', String(b.y), String(b.x), file], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
  }
  console.log(
    `${file}  ${b.width}x${b.height} -> ${b.w}x${b.h}` +
      `  (art at ${b.x},${b.y}; aspect ${(b.w / b.h).toFixed(3)})${same ? '  already tight' : ''}`,
  );
}
