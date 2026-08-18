import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { DOT, LAND_DOTS, MAP, project } from '@/data/worldMap';

/**
 * The real Ningbo → Casablanca lane: down the South China Sea, through the
 * Malacca Strait, across the Indian Ocean, up the Red Sea and Suez, out through
 * Gibraltar. Roughly 11,400 nautical miles. Ports carrying a `label` get a
 * marker; the rest are only there to shape the curve.
 */
type Waypoint = { lon: number; lat: number; label?: string; note?: string; anchor?: 'start' | 'end' | 'middle' };

const LANE: Waypoint[] = [
  { lon: 121.55, lat: 29.87, label: 'Ningbo', note: 'Load port', anchor: 'end' },
  { lon: 120.5, lat: 26.5 },
  { lon: 117.0, lat: 22.0 },
  { lon: 112.5, lat: 16.5 },
  { lon: 109.0, lat: 9.0 },
  { lon: 104.6, lat: 2.2, label: 'Singapore', note: 'Malacca Strait', anchor: 'start' },
  { lon: 98.5, lat: 5.5 },
  { lon: 88.0, lat: 6.2 },
  { lon: 77.0, lat: 6.0 },
  { lon: 65.0, lat: 9.5 },
  { lon: 55.0, lat: 11.8 },
  { lon: 45.5, lat: 12.2 },
  { lon: 43.3, lat: 12.6 },
  { lon: 39.0, lat: 18.5 },
  { lon: 35.2, lat: 25.0 },
  { lon: 32.55, lat: 29.9, label: 'Suez', note: 'Canal transit', anchor: 'start' },
  { lon: 32.0, lat: 31.6 },
  { lon: 25.0, lat: 33.8 },
  { lon: 15.0, lat: 36.0 },
  { lon: 5.0, lat: 37.2 },
  { lon: -2.0, lat: 36.2 },
  { lon: -5.6, lat: 35.95 },
  { lon: -7.62, lat: 33.6, label: 'Casablanca', note: 'Cleared & delivered', anchor: 'start' },
];

/**
 * Photographs pinned to each end of the lane. Every picture we own is from the
 * buying side in China, so the captions describe the stage rather than claiming
 * a Moroccan location we have no photograph of.
 */
const NODE_W = 280;
const NODE_H = 112;

/**
 * Photographs pinned to each end of the lane. Every picture we own is from the
 * buying side in China, so the captions describe the stage rather than claiming
 * a Moroccan location we have no photograph of.
 *
 * Both cards are placed relative to the port they belong to and to the map's own
 * bounds — never in raw viewBox numbers. Retuning the window in build-map.mjs
 * shifts every projected coordinate, and hardcoded boxes silently drift off the
 * lane when that happens.
 */
const NODES = [
  {
    id: 'china',
    src: '/images/gallery/gallery-2.jpg',
    alt: 'A forklift loading cartons into a container at the Hangzhou warehouse',
    caption: 'Loaded by our own team',
    place: 'Hangzhou',
    anchor: project(121.55, 29.87),
    // Above the load port, tucked into the empty north-east corner.
    box: { x: MAP.width - NODE_W - 20, y: 4, w: NODE_W, h: NODE_H },
    side: 'above' as const,
  },
  {
    id: 'morocco',
    src: '/images/gallery/gallery-18.jpg',
    alt: 'Textile bales loaded for Morocco',
    caption: 'Textile bales for Morocco',
    place: 'Ben Guerir',
    anchor: project(-7.62, 33.6),
    // Below the discharge port, over the empty Atlantic and western Sahara.
    box: { x: 14, y: 168, w: NODE_W, h: NODE_H },
    side: 'below' as const,
  },
];

/** Leader line between a card edge and its port, kept inside the card's width. */
function leader(node: (typeof NODES)[number]) {
  const { box, anchor, side } = node;
  const x = Math.min(Math.max(anchor[0], box.x + 24), box.x + box.w - 24);
  return side === 'above'
    ? { x1: x, y1: box.y + box.h, x2: anchor[0], y2: anchor[1] - 9 }
    : { x1: x, y1: box.y, x2: anchor[0], y2: anchor[1] + 9 };
}

/** Catmull-Rom through the waypoints, converted to cubic beziers. */
function smoothPath(points: [number, number][]) {
  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/** One leg of the voyage takes this many seconds of wall clock. */
const VOYAGE_SECONDS = 26;

export function RouteMap({ progress }: { progress: MotionValue<number> }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<SVGPathElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const vesselRef = useRef<SVGGElement>(null);
  const [leg, setLeg] = useState(0);

  /**
   * The world map only earns its space on a wide viewport. At 390px the band
   * collapses to about 105px tall and the port labels land near 3px — the
   * geography stops being readable and becomes noise. Below lg we swap in a
   * compact two-port lane instead of scaling the map down.
   *
   * This is a real branch rather than a `hidden lg:block` class so phones never
   * mount the 3 000-square landmass path or run the animation frame loop.
   */
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Land is one <path> of tiny squares rather than 3 000 <circle> nodes: same
  // picture, one element for the compositor to move when the map parallaxes.
  const dotsPath = useMemo(() => {
    let d = '';
    for (let i = 0; i < LAND_DOTS.length; i += 2) {
      d += `M${LAND_DOTS[i]},${LAND_DOTS[i + 1]}h${DOT}v${DOT}h-${DOT}z`;
    }
    return d;
  }, []);

  const routeD = useMemo(() => smoothPath(LANE.map((p) => project(p.lon, p.lat))), []);
  const marks = useMemo(
    () =>
      LANE.filter((p): p is Waypoint & { label: string } => Boolean(p.label)).map((p) => ({
        ...p,
        xy: project(p.lon, p.lat),
      })),
    [],
  );

  // Mouse parallax, softened so it drifts rather than snaps.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 55, damping: 20, mass: 0.6 });
  const py = useSpring(my, { stiffness: 55, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (!wide) return;
    const onMove = (event: PointerEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set(((event.clientX - rect.left) / rect.width - 0.5) * -34);
      my.set(((event.clientY - rect.top) / rect.height - 0.5) * -16);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my, wide]);

  useAnimationFrame((t) => {
    const route = routeRef.current;
    const comet = cometRef.current;
    if (!wide || !route || !comet) return;
    const len = route.getTotalLength();
    const cycle = (t / 1000 / VOYAGE_SECONDS) % 1;

    // The comet is a short lit segment sliding along the same path the dashes
    // sit on, so the two can never drift out of register.
    comet.style.strokeDasharray = `${len * 0.055} ${len}`;
    comet.style.strokeDashoffset = `${-cycle * len}`;

    const point = route.getPointAtLength(cycle * len);
    vesselRef.current?.setAttribute('transform', `translate(${point.x} ${point.y})`);

    // Only re-render React when the vessel actually crosses into a new leg.
    const next = Math.min(marks.length - 1, Math.floor(cycle * marks.length));
    setLeg((current) => (current === next ? current : next));

    // Parallax + a gentle scroll drift, applied straight to the DOM.
    const group = wrapRef.current?.querySelector('[data-map-layer]') as SVGGElement | null;
    if (group) group.setAttribute('transform', `translate(${px.get()} ${py.get() + progress.get() * 34})`);
  });

  const active = marks[leg] ?? marks[0];

  if (!wide) return <MobileLane />;

  return (
    <div ref={wrapRef} className="relative w-full" data-testid="hero-route-map">
      <svg
        viewBox={`0 0 ${MAP.width} ${MAP.height}`}
        preserveAspectRatio="xMidYMax meet"
        className="h-auto w-full"
        role="img"
        aria-label="Shipping route from Ningbo, China to Casablanca, Morocco via the Malacca Strait and the Suez Canal"
      >
        <defs>
          <linearGradient id="routeGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#5EC2E8" />
            <stop offset="55%" stopColor="#1D96C9" />
            <stop offset="100%" stopColor="#F2765C" />
          </linearGradient>
          <radialGradient id="cometGlow">
            <stop offset="0%" stopColor="#F2765C" stopOpacity=".55" />
            <stop offset="100%" stopColor="#F2765C" stopOpacity="0" />
          </radialGradient>
          {/* Dissolves the landmass into the dark at the top of the band, where
              the copy sits over it. Masking the dots rather than laying an
              opaque scrim over the whole band keeps the section's background
              glow showing through — a solid overlay cut a visible seam across
              the blur behind it. */}
          <linearGradient id="landFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" />
            <stop offset="30%" stopColor="#fff" />
          </linearGradient>
          <mask id="landMask">
            <rect width={MAP.width} height={MAP.height} fill="url(#landFade)" />
          </mask>
          {NODES.map((node) => (
            <clipPath key={node.id} id={`clip-${node.id}`}>
              <rect x={node.box.x} y={node.box.y} width={node.box.w} height={node.box.h} rx="16" />
            </clipPath>
          ))}
        </defs>

        <g data-map-layer>
          <path d={dotsPath} mask="url(#landMask)" className="fill-sky/[0.42]" />

          {/* Three passes over the same geometry: a wide soft bed, the dashed
              lane itself, then the travelling comet. */}
          <path d={routeD} fill="none" stroke="url(#routeGrad)" strokeWidth="10" opacity=".14" strokeLinecap="round" />
          <path
            d={routeD}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="2.6"
            strokeDasharray="13 11"
            strokeLinecap="round"
            className="animate-dash"
          />
          <path
            ref={routeRef}
            d={routeD}
            fill="none"
            stroke="none"
            strokeWidth="2.6"
          />
          <path
            ref={cometRef}
            d={routeD}
            fill="none"
            stroke="#F2765C"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ strokeDasharray: '180 9999', strokeDashoffset: -1400 }}
          />

          {marks.map((mark) => {
            const [x, y] = mark.xy;
            const isEnd = mark.label === 'Ningbo' || mark.label === 'Casablanca';
            const dx = mark.anchor === 'end' ? -16 : 16;
            return (
              <g key={mark.label}>
                <circle cx={x} cy={y} r={isEnd ? 7 : 4.5} className={isEnd ? 'fill-coral' : 'fill-sky'} />
                {isEnd && <circle cx={x} cy={y} r="7" className="fill-none stroke-coral/50" strokeWidth="7" />}
                <text
                  x={x + dx}
                  y={y + 5}
                  textAnchor={mark.anchor}
                  className="fill-white font-mono font-medium"
                  style={{ fontSize: 15, letterSpacing: 1.6 }}
                >
                  {mark.label.toUpperCase()}
                </text>
                {mark.note && (
                  <text
                    x={x + dx}
                    y={y + 25}
                    textAnchor={mark.anchor}
                    className="fill-sky/70 font-mono"
                    style={{ fontSize: 12, letterSpacing: 1.2 }}
                  >
                    {mark.note}
                  </text>
                )}
              </g>
            );
          })}

          <g ref={vesselRef} transform="translate(900 300)">
            <circle r="34" fill="url(#cometGlow)" />
            <circle r="6.5" className="fill-white" />
            <circle r="12" className="fill-none stroke-white/40" strokeWidth="1.5" />
          </g>

          {NODES.map((node) => (
            <g key={node.id}>
              <line
                {...leader(node)}
                className="stroke-coral/45"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />
              <rect
                x={node.box.x - 1}
                y={node.box.y - 1}
                width={node.box.w + 2}
                height={node.box.h + 2}
                rx="17"
                className="fill-abyss/80 stroke-white/15"
                strokeWidth="1.5"
              />
              <image
                href={node.src}
                x={node.box.x}
                y={node.box.y}
                width={node.box.w}
                height={node.box.h}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#clip-${node.id})`}
                opacity=".9"
              />
              <rect
                x={node.box.x}
                y={node.box.y + node.box.h - 46}
                width={node.box.w}
                height="46"
                clipPath={`url(#clip-${node.id})`}
                className="fill-abyss/85"
              />
              <text
                x={node.box.x + 16}
                y={node.box.y + node.box.h - 26}
                className="fill-white font-mono"
                style={{ fontSize: 13, letterSpacing: 1.1 }}
              >
                {node.caption}
              </text>
              <text
                x={node.box.x + 16}
                y={node.box.y + node.box.h - 11}
                className="fill-sky/70 font-mono"
                style={{ fontSize: 11, letterSpacing: 1.4 }}
              >
                {node.place.toUpperCase()}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Live readout, in the flow rather than the SVG so it can use real type.
          Bottom-left, not bottom-right: the fixed WhatsApp launcher owns that
          corner on every page. */}
      <div className="pointer-events-none absolute bottom-5 left-5 hidden items-center gap-3 rounded-full border border-white/15 bg-abyss/70 px-4 py-2 backdrop-blur lg:flex">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-pulseRing rounded-full bg-coral" />
          <span className="relative h-2 w-2 rounded-full bg-coral" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist/80">
          {active?.label} · {active?.note ?? 'under way'}
        </span>
      </div>
    </div>
  );
}

/**
 * The phone version of the same story: the two photographs that bookend the
 * lane, and a lane between them carrying the ports and the two waypoints the
 * cargo actually passes. No coastline — at this width a real map cannot be read,
 * and a map you cannot read is just texture.
 */
function MobileLane() {
  return (
    <div className="shell pb-7" data-testid="hero-route-lane">
      <div className="grid grid-cols-2 gap-3">
        {NODES.map((node) => (
          <figure key={node.id} className="overflow-hidden rounded-2xl border border-white/15 bg-abyss/60">
            <img
              src={node.src}
              alt={node.alt}
              width={560}
              height={224}
              className="h-[72px] w-full object-cover opacity-90 sm:h-32"
            />
            <figcaption className="px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-sky/85">{node.place}</p>
              <p className="mt-0.5 text-[11px] leading-tight text-mist/75">{node.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Inset from the right: the fixed WhatsApp launcher is 56px plus a 20px
          margin, and it lands exactly on the discharge port otherwise. */}
      <div className="pr-20">
        <div className="relative mt-4 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-coral" />
          <span className="relative h-px flex-1 bg-[repeating-linear-gradient(90deg,rgba(94,194,232,.55)_0_5px,transparent_5px_11px)]">
            <motion.span
              aria-hidden="true"
              className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-white shadow-[0_0_10px_3px_rgba(242,118,92,.55)]"
              initial={{ left: '0%' }}
              animate={{ left: '100%' }}
              transition={{ duration: VOYAGE_SECONDS, repeat: Infinity, ease: 'linear' }}
            />
          </span>
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-coral" />
        </div>

        <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.14em]">
          <span className="text-shell">Ningbo</span>
          <span className="text-sky/60">Malacca · Suez</span>
          <span className="text-shell">Casablanca</span>
        </div>
      </div>
    </div>
  );
}
