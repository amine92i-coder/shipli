import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useTransform, type MotionValue } from 'framer-motion';
import { TALL, WIDE, type Country, type Scene } from '@/data/countries';

/**
 * The hero scene: two countries, open water, and the crossing between them.
 *
 * Composition notes
 * -----------------
 * The ocean is a plain <img> underneath at object-cover, so it always fills the
 * section no matter the viewport. Everything that carries meaning — the two
 * landmasses, the routes, the props — lives in an SVG on top at
 * preserveAspectRatio="meet", so it scales to fit and is never cropped. That
 * split is deliberate: "slice" on the whole scene would crop Morocco off the
 * left edge on a tall viewport, which is the one thing that must never happen.
 *
 * Each country is filled with its own flag and then has painted terrain blended
 * over the top — see FLAGS below for why it is that way round.
 *
 * There are two frames, WIDE and TALL, and every measurement below is per-frame.
 * They are not the same picture at two sizes: the wide frame runs the lane along
 * a shallow diagonal, the tall one sets the countries side by side in the strip
 * of a phone screen the headline leaves free. See scripts/build-countries.mjs.
 */

/**
 * Everything that has to be restated when the frame changes. It is one object
 * per frame rather than a pile of responsive classes because these are viewBox
 * units, not CSS — a phone showing 900 units across 390px renders a unit at less
 * than half the size a 1440px desktop does, so strokes and props all have to be
 * respecified rather than scaled by the browser.
 */
type Spec = {
  scene: Scene;
  /** Sea and air lanes. Not true great circles — the countries are placed for
   *  composition, not on a shared projection, so lanes are drawn to read well. */
  seaRoute: string;
  airRoute: string;
  /** Painted-plate overhang around each silhouette. */
  slack: number;
  /** Coastline stroke. Drawn under the plate, so half of it is covered. */
  coast: number;
  sea: { width: number; dash: string };
  air: { width: number; dash: string };
  /** The two thought bubbles hanging off China. */
  thoughts: { goods: Thought; papers: Thought };
  ship: { w: number; h: number };
  plane: { w: number; h: number };
  glow: number;
  dot: { r: number; ring: number };
  /**
   * Where each flag's emblem sits. NOT derived from the country's bounding box:
   * a flag mapped onto a bbox puts its canton in the top-left CORNER, and
   * neither country has land there — China's northernmost point is in the far
   * north-east, and Morocco is a diagonal sliver. These are the deepest points
   * inside each silhouette, found by scripts/emblem-anchors.mjs, so the emblem
   * is as far from a clipping edge as the shape allows.
   *
   * `s` scales China's five-star arc, which is drawn in its own flag units;
   * `r` is the circumradius of Morocco's pentagram.
   */
  emblem: { china: { x: number; y: number; s: number }; morocco: { x: number; y: number; r: number } };
  /**
   * The stretch of each lane its craft may actually occupy, as a fraction of
   * path length.
   *
   * The LANE still runs port to port — that is the route, and it has to read as
   * one unbroken line. But both port anchors are real coastal coordinates
   * projected from lon/lat, and both land INSIDE their country's silhouette, so
   * a craft driven across the full 0..1 finishes its run inland. Re-derive these
   * with `node scripts/lane-runs.mjs` after any change to the country scales —
   * the crossings move with them. As drawn, the lanes are over land for:
   *
   *            over China      over Morocco
   *   wide sea  0 .. 0.03       0.92 .. 1
   *   wide air  0 .. 0.21       0.91 .. 1
   *   tall sea  0 .. 0.12       0.91 .. 1
   *   tall air  0 .. 0.37       0.87 .. 1
   *
   * The ship is held to open water. Its centreline clearing the coast is not
   * enough — the hull is ~19% of the wide lane and ~29% of the tall one, and it
   * is drawn along the tangent, so a centre parked at the coast lays the whole
   * vessel across the country. On a phone that put a container ship diagonally
   * across Morocco. The end of the run is backed off by somewhat less than half
   * a hull, which arrives bow-first at the quay — a ship docking, not a ship
   * aground.
   *
   * The plane is NOT clipped to water. Aircraft over land is what a flight path
   * looks like, and holding it off China would delete most of the tall arc.
   */
  run: { sea: [number, number]; air: [number, number] };
};

/**
 * One thought bubble: a rounded plate centred on (x,y) with a side of `size`,
 * and a tail of shrinking dots leaving it on the `tail` bearing — SVG degrees,
 * so 0 is due east and -90 due north.
 *
 * The bearing is stated rather than computed from China's port anchor, which is
 * what it mostly points at. Two bubbles both aiming at one anchor produce tails
 * that run into each other — in the tall frame the western bubble's tail would
 * land squarely on the eastern one, which reads as one bubble thinking about the
 * other. Each bearing is chosen to point at China AND to leave its neighbour
 * alone, and only a stated number can satisfy both.
 */
type Thought = { x: number; y: number; size: number; tail: number };

const WIDE_SPEC: Spec = {
  scene: WIDE,
  // Leaves Ningbo southbound, ducks under China, then runs west across open
  // water. The dip is what keeps the lane off the landmass it just left.
  seaRoute: `M${WIDE.china.port.x},${WIDE.china.port.y} C1330,610 980,720 ${WIDE.morocco.port.x},${WIDE.morocco.port.y}`,
  // Held well above the sea lane so the two never read as one. It does cross
  // southern China on the way out, which is correct — it is a plane.
  airRoute: `M${WIDE.china.port.x},${WIDE.china.port.y} C1240,400 860,430 ${WIDE.morocco.port.x},${WIDE.morocco.port.y}`,
  slack: 12,
  coast: 3.6,
  // Both dash patterns sum to 24, which divides the shared `dash` keyframe's
  // -120 offset exactly; any other cycle length visibly hiccups each loop.
  sea: { width: 2.6, dash: '10 14' },
  air: { width: 2, dash: '5 19' },
  // Both tuck into the small pocket of water immediately south-east of the
  // Ningbo beacon, and both tails aim back at it. They used to be roughly a
  // third of China's width and sat far out in the open water toward the bottom
  // of the frame; at that size and distance they stopped reading as something
  // China was thinking and started reading as two more objects in the scene,
  // competing with the ship. Now they are ~13% and ~15% of China's 481-unit
  // width, which is the proportion the reference art uses, and they sit close
  // enough to the beacon that the tails are short.
  //
  // The trade is legibility: at 72 units the certificate's heading is no longer
  // readable, only its shape, the gold stamp and the green tick. That is the
  // point of the reference composition — the bubble is a glyph, not a document
  // viewer — but it is a real loss and worth knowing before shrinking further.
  //
  // Verified with scripts/bubble-fit.mjs (land / sea lane / air lane / edge):
  // goods 64 / 64 / 77 / 57, papers 77 / 50 / 117 / 99.
  //
  // The CERTIFICATE still gets the bigger plate and the carton the smaller one.
  // A carton is legible as a silhouette at any size; a sheet of paper needs
  // every unit it can get. Size goes where it buys something.
  thoughts: {
    // Below-left of the goods plate, tail up-and-left at the beacon. The dots
    // stop at x1455, twenty-six units short of the goods plate's left edge.
    papers: { x: 1465, y: 451, size: 72, tail: -100 },
    // Nearer the beacon and higher, tail up-and-left along the same bearing.
    goods: { x: 1512, y: 371, size: 62, tail: -130 },
  },
  ship: { w: 50, h: 194 },
  plane: { w: 104, h: 110 },
  glow: 76,
  dot: { r: 7, ring: 14 },
  emblem: { china: { x: 1328.6, y: 249.6, s: 10.7 }, morocco: { x: 579.1, y: 579.4, r: 29 } },
  // Hull is 194 of a 1038-unit lane. Ending at 0.84 puts the bow at ~0.93 —
  // just onto the Moroccan coast, which is where a ship arriving should be.
  run: { sea: [0.04, 0.84], air: [0.03, 0.96] },
};

const TALL_SPEC: Spec = {
  scene: TALL,
  // Ningbo is on China's east coast, so the lane leaves to the right and has to
  // duck under the landmass before it can run west — same move the wide frame
  // makes, just steeper.
  seaRoute: `M${TALL.china.port.x},${TALL.china.port.y} C700,1300 340,1300 ${TALL.morocco.port.x},${TALL.morocco.port.y}`,
  airRoute: `M${TALL.china.port.x},${TALL.china.port.y} C640,1060 340,1010 ${TALL.morocco.port.x},${TALL.morocco.port.y}`,
  slack: 10,
  coast: 6,
  // 40 also divides 120 exactly. Doubling keeps the dashes from packing into an
  // unreadable dotted line at the tall frame's much smaller on-screen unit.
  sea: { width: 4, dash: '16 24' },
  air: { width: 3.2, dash: '8 32' },
  // The tall frame has no pocket like the wide one's — the two countries sit
  // side by side along the bottom, so the only clear water near China is the
  // CHANNEL between them, about 190 units deep between the air lane's crest
  // (~y1050) and the sea lane's belly (~y1250). Two plates go in it
  // diagonally, which is the one arrangement that fits: side by side they have
  // no room to breathe, and stacked they do not fit at all.
  //
  // Everything above the channel is off limits, however open the water looks.
  // scripts/bubble-fit.mjs measures the scene, not the page, and the strip
  // above China is where the copy column lands on a short phone — on a 375x667
  // the hero copy reaches viewBox y~980, which is why nothing here sits above
  // y1060.
  //
  // Shrunk with the wide frame's, but NOT as far and NOT moved next to the
  // beacon. Both would have cost more here than they buy. A sweep of the water
  // beside China's dot fits exactly one plate of this size, not two — and the
  // tall frame renders at about 0.43 CSS px per unit on a phone, so the wide
  // frame's 62 units would come out 27px across, which is a smudge rather than
  // a carton. These stay in the channel, where the room is, and earn the
  // relationship with the beacon through their tails instead of proximity.
  thoughts: {
    // Due east, straight at the beacon, which sits almost exactly level with
    // this plate at y1164.
    papers: { x: 462, y: 1168, size: 72, tail: 0 },
    // Also at the beacon, which from up here is slightly DOWN and east. The
    // dots stop at x395, thirty-one short of the papers plate.
    goods: { x: 348, y: 1112, size: 60, tail: 7 },
  },
  ship: { w: 52, h: 202 },
  plane: { w: 92, h: 98 },
  glow: 58,
  dot: { r: 10, ring: 20 },
  emblem: { china: { x: 694.4, y: 1145.5, s: 6.75 }, morocco: { x: 169.9, y: 1105.8, r: 25.5 } },
  // Tighter at both ends than the wide frame: the hull is 202 of a 690-unit
  // lane here, nearly a third of it, and the channel between the two countries
  // is the only water there is.
  run: { sea: [0.12, 0.78], air: [0.04, 0.95] },
};

const SEA_SECONDS = 34;
const AIR_SECONDS = 21;
/** The plane waits out part of each cycle so both craft aren't always in frame. */
const AIR_DUTY = 0.62;
/**
 * Both lanes start at Ningbo, which is also where the beacon and its 76-unit
 * glow are drawn — so at phase 0 the ship and plane sit on top of the dot, and
 * edgeFade has them at zero opacity besides, making the first paint an empty
 * ocean. Start them already under way, out in open water.
 */
const SEA_PHASE = 0.38;
const AIR_PHASE = 0.22;

/** Matches once and stays subscribed. */
function useMedia(query: string, initial: boolean) {
  const [matches, setMatches] = useState(
    () => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches),
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [query]);
  return matches;
}

export function CrossingScene({ progress }: { progress: MotionValue<number> }) {
  const seaRef = useRef<SVGPathElement>(null);
  const airRef = useRef<SVGPathElement>(null);
  const shipRef = useRef<SVGGElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  const y = useTransform(progress, [0, 1], [0, 60]);
  const opacity = useTransform(progress, [0, 0.85], [1, 0]);

  // Ambient motion only — there is no mouse parallax here. The backdrop is one
  // painted plate, so sliding layers against each other would fight its own
  // light and reveal the cut-outs' edges.
  const still = useMedia('(prefers-reduced-motion: reduce)', false);
  // Squarer than 1:1 and the wide frame's diagonal stops fitting; the tall frame
  // takes over well before a phone gets there.
  const wide = useMedia('(min-aspect-ratio: 1/1)', true);
  const spec = wide ? WIDE_SPEC : TALL_SPEC;
  const { scene } = spec;

  // rAF is throttled to nothing in a background tab, and an unplaced <g> sits
  // at the viewBox origin — a ship stranded in the top-left corner. Seat both
  // craft on their lanes once at mount, and again whenever the frame swaps the
  // paths out underneath them, so the first paint is always correct.
  useEffect(() => {
    if (seaRef.current && shipRef.current) {
      place(seaRef.current, shipRef.current, along(spec.run.sea, SEA_PHASE), 90);
    }
    if (airRef.current && planeRef.current) {
      place(airRef.current, planeRef.current, along(spec.run.air, AIR_PHASE), -180);
    }
  }, [spec]);

  useAnimationFrame((t) => {
    const sea = seaRef.current;
    const air = airRef.current;
    const ship = shipRef.current;
    const plane = planeRef.current;
    if (!sea || !air || !ship || !plane) return;

    // Park both craft mid-ocean and stop.
    // edgeFade reads the CYCLE position, not the mapped one, so a craft fades in
    // and out at the ends of its own run rather than at the ends of the lane.
    const seaT = still ? 0.5 : (SEA_PHASE + t / 1000 / SEA_SECONDS) % 1;
    ship.style.opacity = still ? '1' : String(edgeFade(seaT));
    place(sea, ship, along(spec.run.sea, seaT), 90);

    const airCycle = still ? 0.5 : (AIR_PHASE + t / 1000 / AIR_SECONDS) % 1;
    const airT = still ? 0.5 : Math.min(airCycle / AIR_DUTY, 1);
    // The duty gate is a hard on/off, but edgeFade has already taken the plane
    // to zero by the time it fires, so the cut lands on an invisible plane.
    plane.style.opacity = still ? '1' : airCycle < AIR_DUTY ? String(edgeFade(airT)) : '0';
    place(air, plane, along(spec.run.air, airT), -180);
  });

  return (
    <motion.div style={{ y, opacity }} className="absolute inset-0" data-testid="hero-crossing-scene">
      <img
        src="/images/hero/ocean.jpg"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Three scrims, each doing one job: knock the painted dawn back so it
          reads as a backdrop rather than a photograph; hold contrast under the
          headline on the left; and darken the top strip, without which the
          navigation's white logo and links sit on bright water and vanish.
          The headline scrim turns vertical in the tall frame, where the copy is
          full-bleed and there is no "left" to protect. */}
      <div className="absolute inset-0 bg-abyss/40" />
      <div
        className={`absolute inset-0 ${
          wide
            ? 'bg-gradient-to-r from-abyss via-abyss/55 to-transparent'
            : 'bg-gradient-to-b from-abyss via-abyss/70 to-transparent'
        }`}
      />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-abyss/85 to-transparent" />

      {/* YMax, not YMid. On a viewport wider than its frame the scene fits by
          height and this does nothing. On a narrower one it fits by width and
          letterboxes vertically — and centring that letterbox walks Morocco
          straight up into the headline. Settling the scene on the bottom edge
          instead puts the slack above the land, where there is nothing but open
          water and the copy is already sitting. */}
      <svg
        key={wide ? 'wide' : 'tall'}
        viewBox={`0 0 ${scene.width} ${scene.height}`}
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="clipMorocco">
            <path d={scene.morocco.path} />
          </clipPath>
          <clipPath id="clipChina">
            <path d={scene.china.path} />
          </clipPath>
          <filter id="landLift" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="#04263B" floodOpacity="0.75" />
          </filter>
          {/* Morocco's plate is a high-key desert aerial — left alone it blends
              to a washed pink over the flag and the eye lands on Western Sahara
              instead of on the headline. A linear ramp per channel, not a flat
              dark overlay: overlaying raises the blacks and the ridges go to
              mud, whereas scaling each channel keeps the shadows deep while
              pulling the sand down. China's plate was already graded cool and
              needs none of this. */}
          <filter id="gradeMorocco" x="0%" y="0%" width="100%" height="100%"
            colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.60" intercept="0.02" />
              <feFuncG type="linear" slope="0.52" intercept="0.035" />
              <feFuncB type="linear" slope="0.46" intercept="0.075" />
            </feComponentTransfer>
          </filter>
          <radialGradient id="portGlow">
            <stop offset="0%" stopColor="#F2765C" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F2765C" stopOpacity="0" />
          </radialGradient>
          {/* Softer and shallower than landLift: a bubble is a small object
              floating just above the water, not a continent sitting on it.

              These are USER-SPACE units, so they do not scale with the plate.
              Halved when the plates were halved — a 7-unit drop under a 158-unit
              plate is a hint, the same drop under a 62-unit one is a slab. */}
          <filter id="bubbleLift" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#04263B" floodOpacity="0.5" />
          </filter>
          {/* Top-edge sheen. objectBoundingBox units, so one gradient serves
              plates of different sizes in both frames. */}
          <linearGradient id="bubbleSheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.13" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- land ---------------------------------------------------------
            Each country is its flag, clipped to its true outline, with the
            painted terrain blended over the top.

            That order is the whole trick. Painting the flag ON TOP would hide
            the terrain and leave two flat rectangles of red; blending it under
            in soft-light keeps every ridge and river the model painted while
            the country still reads, unmistakably, as its flag. It also solves
            the two-red problem: China and Morocco fly almost the same red, and
            it is the terrain — cool granite over China, warm desert over
            Morocco — that keeps them apart.

            The coastline is stroked UNDERNEATH, at double width, so the opaque
            fill covers its inner half and only the outer rim survives. That
            ordering is not a flourish — it is what keeps Morocco whole. Natural
            Earth ships Western Sahara as its own polygon, so the Morocco path
            holds two rings, and stroking it on top draws the border between them
            straight across the country. Every interior edge is by definition
            covered by the fill, so stroking underneath welds the two into one
            silhouette and no internal border can appear.

            THE NESTING BELOW IS LOAD-BEARING — clip on the OUTSIDE, isolate and
            blend on the INSIDE. Two separate traps, both of which produced a
            scene with no flag in it at all:

            1. clip-path forms an isolated group. With the plate wrapped in its
               own <g clip-path>, soft-light had nothing to blend against but
               transparency inside that group, and the group then composited
               over the red opaquely. The plate painted at full strength and the
               flag was invisible — which looks exactly like "the blend is too
               strong", and is not. The red and the plate have to be siblings
               inside one isolate group for them to see each other at all.

            2. clip-path and transform on the SAME element resolve in the wrong
               order for this: the clip is evaluated in the element's POST-
               transform user space. China's stars carry scale(12), so the
               country-shaped clip was being applied at twelve times its size
               and a thousand units off, and every star fell outside it. The
               transform now sits on an inner group with no clip of its own. */}
        <g filter="url(#landLift)">
          <path d={scene.morocco.path} fill="none" stroke="#F0D9A8" strokeWidth={spec.coast}
            strokeLinejoin="round" opacity="0.6" />
          <g clipPath="url(#clipMorocco)">
            <g style={{ isolation: 'isolate' }}>
              <path d={scene.morocco.path} fill={MOROCCO_RED} />
              <image href="/images/hero/land-morocco.jpg" {...plate(scene.morocco, spec.slack)}
                preserveAspectRatio="xMidYMid slice" filter="url(#gradeMorocco)"
                opacity={PLATE}
                style={{ mixBlendMode: 'soft-light' }} />
            </g>
            {/* Unfilled and interlaced, as the flag has it. */}
            <path d={pentagram(spec.emblem.morocco.x, spec.emblem.morocco.y, spec.emblem.morocco.r)}
              fill="none" stroke={MOROCCO_GREEN} strokeWidth={spec.emblem.morocco.r * 0.2}
              strokeLinejoin="round" opacity="0.92" />
          </g>

          <path d={scene.china.path} fill="none" stroke="#5EC2E8" strokeWidth={spec.coast}
            strokeLinejoin="round" opacity="0.55" />
          <g clipPath="url(#clipChina)">
            <g style={{ isolation: 'isolate' }}>
              <path d={scene.china.path} fill={CHINA_RED} />
              <image href="/images/hero/land-china.jpg" {...plate(scene.china, spec.slack)}
                preserveAspectRatio="xMidYMid slice" opacity={PLATE}
                style={{ mixBlendMode: 'soft-light' }} />
            </g>
            {/* Transform only — the clip is on the group ABOVE for a reason; see
                the note on clip/transform ordering above. */}
            <g opacity="0.92"
              transform={`translate(${spec.emblem.china.x} ${spec.emblem.china.y}) scale(${spec.emblem.china.s})`}>
              {CHINA_STARS.map(({ x, y: sy, r, rot }, i) => (
                <path key={i} d={star(x - 7.5, sy - 5.5, r, rot)} fill={CHINA_GOLD} />
              ))}
            </g>
          </g>
        </g>

        {/* --- lanes -------------------------------------------------------- */}
        <path ref={seaRef} d={spec.seaRoute} fill="none" stroke="#5EC2E8" strokeWidth={spec.sea.width}
          strokeDasharray={spec.sea.dash} strokeLinecap="round" opacity="0.5"
          className="animate-dash [animation-duration:9s]" />
        <path ref={airRef} d={spec.airRoute} fill="none" stroke="#F0D9A8" strokeWidth={spec.air.width}
          strokeDasharray={spec.air.dash} strokeLinecap="round" opacity="0.4"
          className="animate-dash [animation-duration:6s]" />

        {/* --- what China is thinking ---------------------------------------
            Two thought bubbles hanging off China: the goods, and the paperwork
            that proves them. They replace a painted port complex and a stack of
            containers that used to sit on the coast — literal cargo drawn as
            scenery, which said "there is a factory over there" and nothing more.

            A thought bubble says something the scenery could not: that what
            China holds is not a building but an ORDER, and that the inspection
            certificate is part of the order rather than an afterthought. It is
            also the one device that can put a legible document in a hero at all
            — a sheet of A4 lying in open water is a prop, the same sheet inside
            a bubble is a subject, and only the second survives being 130 units
            wide.

            Different drift periods, and neither is a multiple of the other, so
            the pair never settles into moving as one block. */}
        <Bubble t={spec.thoughts.papers} href="/images/hero/bubble-doc.png"
          className="animate-drift [animation-duration:11s]" />
        <Bubble t={spec.thoughts.goods} href="/images/hero/bubble-box.png"
          className="animate-drift [animation-duration:14s]" />

        {/* --- craft -------------------------------------------------------- */}
        {/* Drawn about their own origin so place() only has to translate and
            rotate — the artwork is offset by half its size here, once.

            Both boxes are set to their artwork's own aspect ratio. <image>
            defaults to "meet", so a box that disagrees with the art letterboxes
            it: the plane used to sit in an 80x42 box and painted at 39x42, less
            than half the size the number suggested. */}
        <g ref={shipRef}>
          <image href="/images/hero/ship.png" x={-spec.ship.w / 2} y={-spec.ship.h / 2}
            width={spec.ship.w} height={spec.ship.h} />
        </g>
        <g ref={planeRef}>
          <image href="/images/hero/plane.png" x={-spec.plane.w / 2} y={-spec.plane.h / 2}
            width={spec.plane.w} height={spec.plane.h} />
        </g>

        {/* --- ports ---------------------------------------------------------
            No names. The two countries are drawn in their own flags and the
            lane runs between them, so a label would only restate what the
            picture already says — and the labels were the one element that had
            to be fought around the ship's swept envelope every cycle. What is
            left is a beacon: a soft glow, a solid dot, and a ring that pulses
            outward, offset between the two ends so they breathe alternately
            rather than blinking in time. */}
        {[
          { c: scene.china, delay: '0s' },
          { c: scene.morocco, delay: '1.3s' },
        ].map(({ c, delay }) => (
          <g key={c.port.name}>
            <circle cx={c.port.x} cy={c.port.y} r={spec.glow} fill="url(#portGlow)" />
            <circle cx={c.port.x} cy={c.port.y} r={spec.dot.ring} fill="none" stroke="#F2765C"
              strokeWidth={spec.dot.r / 3.5} opacity="0.45" />
            <circle cx={c.port.x} cy={c.port.y} r={spec.dot.ring} fill="none" stroke="#F2765C"
              strokeWidth={spec.dot.r / 3} className="animate-pulseRing"
              style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: delay }} />
            <circle cx={c.port.x} cy={c.port.y} r={spec.dot.r} fill="#F2765C" />
            <circle cx={c.port.x} cy={c.port.y} r={spec.dot.r * 0.42} fill="#F5FAFD" opacity="0.9" />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

/** The painted plate behind a country: its silhouette bounds plus overhang. */
function plate({ box: b }: Country, slack: number) {
  return { x: b.x - slack, y: b.y - slack, width: b.w + slack * 2, height: b.h + slack * 2 };
}

/**
 * A thought bubble: a rounded plate with the prop inside, and two shrinking dots
 * trailing off toward whatever is thinking it.
 *
 * Every measurement is a FRACTION OF `size` rather than a number, so one
 * component serves a 158-unit plate in the wide frame and a 76-unit one in the
 * tall frame and both look like the same object. Absolute values here would need
 * a second set in the spec for no gain.
 *
 * The dots trail the plate in the DOM so the plate's shadow falls over them, not
 * under them — a dot lit from the same angle as the thing it hangs off reads as
 * detached from it.
 */
function Bubble({ t, href, className }: { t: Thought; href: string; className: string }) {
  const half = t.size / 2;
  const rad = (t.tail * Math.PI) / 180;
  // Both dots start OUTSIDE the plate (0.5 is its edge) and shrink as they go,
  // which is what separates a thought bubble from a speech balloon's single
  // pointer. Kept short: a long tail crosses a lane sooner or later.
  const dots = [
    { at: 0.6, r: 0.085 },
    { at: 0.78, r: 0.048 },
  ];
  // The prop sits in a square well inside the plate. Both props were padded to
  // 1:1 when they were cut out, so <image>'s default "meet" fills this exactly
  // and neither is letterboxed against the other's proportions.
  //
  // A tenth, not the sixth a card would use. These plates are ~140px on a
  // desktop and the certificate has to survive being that small — every unit of
  // padding is a unit taken off the only thing in the bubble worth looking at.
  const pad = t.size * 0.1;

  return (
    <g className={className} filter="url(#bubbleLift)">
      {dots.map(({ at, r }) => (
        <circle
          key={at}
          cx={t.x + Math.cos(rad) * t.size * at}
          cy={t.y + Math.sin(rad) * t.size * at}
          r={t.size * r}
          fill={BUBBLE_FILL}
          fillOpacity="0.92"
          stroke={BUBBLE_RIM}
          strokeOpacity={RIM_ALPHA}
          strokeWidth={t.size * 0.014}
        />
      ))}
      <rect x={t.x - half} y={t.y - half} width={t.size} height={t.size} rx={t.size * 0.22}
        fill={BUBBLE_FILL} fillOpacity="0.94" stroke={BUBBLE_RIM} strokeOpacity={RIM_ALPHA}
        strokeWidth={t.size * 0.014} />
      <rect x={t.x - half} y={t.y - half} width={t.size} height={t.size} rx={t.size * 0.22}
        fill="url(#bubbleSheen)" />
      <image href={href} x={t.x - half + pad} y={t.y - half + pad}
        width={t.size - pad * 2} height={t.size - pad * 2} />
    </g>
  );
}

/**
 * A shade off `abyss`, not a match for it. The ocean carries a 40% abyss scrim
 * already, so a plate in the section's own darkest colour has nothing to
 * separate it from the water it is supposed to be floating above — but going
 * far the other way turns it into a grey card, and the whole job of the plate is
 * to be the unlit thing that throws a kraft carton and a white certificate
 * forward.
 */
const BUBBLE_FILL = '#072335';
/** The rim is a hairline, not an outline — enough to catch the edge, not enough
 *  to draw a cyan box around the one thing that should read as unlit. */
const BUBBLE_RIM = '#5EC2E8';
const RIM_ALPHA = 0.3;

/* --- flags ------------------------------------------------------------------
 * Both emblems are drawn here rather than fetched or generated. They are exact
 * geometric specifications — five stars in a specific arc, each rotated to face
 * the large one; a pentagram of a specific winding — and an image model cannot
 * be trusted with either. Drawn as paths they are also resolution-free, weigh
 * nothing, and can be recoloured to sit in the palette.
 */
const CHINA_RED = '#D02B25';
const CHINA_GOLD = '#FFDE00';
const MOROCCO_RED = '#BE2B31';
const MOROCCO_GREEN = '#0F7A45';

/**
 * How hard the terrain is pressed into the flag. Soft-light is symmetric in
 * neither direction: a dark plate at full strength walks a saturated red most
 * of the way to black, and both countries came out reading as slate. This is
 * the one lever that trades texture against the flag still being a flag.
 */
const PLATE = 0.62;

/** Turn a small star so its top point aims at the big one, as the flag has it. */
const aim = (x: number, y: number) => (Math.atan2(5 - y, 5 - x) * 180) / Math.PI + 90;

/**
 * Positions are the flag's own 30x20 canton grid: the large star at (5,5) with
 * circumradius 3, four small ones on an arc at circumradius 1. The group is
 * re-centred on (7.5,5.5) — the middle of the cluster — where it is drawn, so
 * the spec only has to name a point inside the country and a scale.
 */
const CHINA_STARS = [
  { x: 5, y: 5, r: 3, rot: 0 },
  { x: 10, y: 2, r: 1, rot: aim(10, 2) },
  { x: 12, y: 4, r: 1, rot: aim(12, 4) },
  { x: 12, y: 7, r: 1, rot: aim(12, 7) },
  { x: 10, y: 9, r: 1, rot: aim(10, 9) },
];

/** A filled five-pointed star, point-up before `rot`. */
function star(cx: number, cy: number, r: number, rot: number) {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    // Outer point, then the notch 36 degrees on. The inner radius of a regular
    // five-pointed star is its circumradius over phi-squared.
    for (const [k, rad] of [
      [i, r],
      [i + 0.5, r / 2.618],
    ] as const) {
      const a = ((k * 72 - 90 + rot) * Math.PI) / 180;
      pts.push(`${(cx + rad * Math.cos(a)).toFixed(3)},${(cy + rad * Math.sin(a)).toFixed(3)}`);
    }
  }
  return `M${pts.join('L')}Z`;
}

/** The {5/2} star polygon — every second vertex — which is what Morocco flies. */
function pentagram(cx: number, cy: number, r: number) {
  const at = (k: number) => {
    const a = ((k * 72 - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  };
  return `M${[0, 2, 4, 1, 3].map(at).join('L')}Z`;
}

/** Maps a 0..1 cycle position onto the stretch of lane a craft may occupy. */
const along = ([lo, hi]: [number, number], t: number) => lo + t * (hi - lo);

/** How much of each RUN the craft spend fading. */
const EDGE = 0.08;

/**
 * 1 through the middle of a lane, 0 at both ends. Both lanes terminate exactly
 * on a port anchor, which is also where that port's beacon is drawn — so a craft
 * running the full length parks on top of the dot once per cycle. Fading at the
 * ends reads as arriving and departing, and keeps the beacons clear.
 */
function edgeFade(t: number) {
  return Math.min(1, Math.min(t, 1 - t) / EDGE);
}

/**
 * Drops `craft` onto `path` at t in [0,1], turned to face the way it is going.
 * `offset` squares the artwork's own heading with the tangent: the ship is
 * painted bow-up (-90) and the plane nose-left (180).
 */
function place(path: SVGPathElement, craft: SVGGElement, t: number, offset: number) {
  const len = path.getTotalLength();
  if (!len) return;
  const at = path.getPointAtLength(len * t);
  // A short step ahead gives the tangent; clamped so t=1 doesn't read past the end.
  const ahead = path.getPointAtLength(Math.min(len * t + 2, len));
  const deg = (Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180) / Math.PI;
  craft.setAttribute('transform', `translate(${at.x} ${at.y}) rotate(${deg + offset})`);
}
