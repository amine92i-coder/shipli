import { motion, useTransform, type MotionValue } from 'framer-motion';
import { Cloud, Gull } from './SceneParts';
import { GLOBE } from './globeData';
import { usePointer } from '@/hooks/usePointer';

/** Seamless wave band: one period every 720 units across a 2880-wide viewBox. */
function wavePath(amp: number, baseY: number, height: number) {
  const period = 720;
  let d = `M0,${baseY}`;
  for (let x = 0; x < 2880; x += period) {
    d += ` C${x + period * 0.3},${baseY - amp} ${x + period * 0.7},${baseY + amp} ${x + period},${baseY}`;
  }
  return `${d} L2880,${height} L0,${height} Z`;
}

type BandProps = {
  bottom: string;
  height: string;
  amp: number;
  fill: string;
  opacity?: number;
  duration: number;
  drift: MotionValue<number>;
  reverse?: boolean;
  zIndex: number;
};

function WaveBand({ bottom, height, amp, fill, opacity = 1, duration, drift, reverse, zIndex }: BandProps) {
  return (
    <motion.div className="pointer-events-none absolute inset-x-0" style={{ bottom, y: drift, zIndex }}>
      <motion.div
        className="w-[200%]"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 2880 260" preserveAspectRatio="none" className="w-full" style={{ height }} aria-hidden="true">
          <path d={wavePath(amp, 90, 260)} fill={fill} opacity={opacity} />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/** Chimney puffs, in globe coordinates so they scale with the sphere. */
function Puffs({ x, y }: { x: number; y: number }) {
  return (
    <g fill="#FFFFFF" opacity=".75">
      {[
        { dx: 0, r: 7, o: 0.7, d: 0 },
        { dx: 6, r: 9, o: 0.5, d: 1.3 },
        { dx: -2, r: 11, o: 0.3, d: 2.6 },
      ].map((p, i) => (
        <circle key={i} cx={x + p.dx} cy={y - i * 22} r={p.r} opacity={p.o}>
          <animate
            attributeName="cy"
            values={`${y - i * 22};${y - i * 22 - 26};${y - i * 22}`}
            dur="7s"
            begin={`${p.d}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values={`${p.o};${p.o * 0.3};${p.o}`}
            dur="7s"
            begin={`${p.d}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

/** Label pill sitting below a landmass, in globe coordinates. */
function Label({ x, y, text, width }: { x: number; y: number; text: string; width: number }) {
  return (
    <g>
      <rect x={x - width / 2} y={y - 26} width={width} height="52" rx="26" fill="#04263B" opacity=".55" />
      <rect
        x={x - width / 2}
        y={y - 26}
        width={width}
        height="52"
        rx="26"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity=".35"
        strokeWidth="2"
      />
      <circle cx={x - width / 2 + 26} cy={y} r="7" fill="#F2765C">
        <animate attributeName="opacity" values="1;.25;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <text
        x={x + 12}
        y={y + 10}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="27"
        fontWeight="700"
        letterSpacing="4"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        {text}
      </text>
    </g>
  );
}

export function GlobeScene({ progress }: { progress: MotionValue<number> }) {
  const pointer = usePointer();

  // Scroll sinks the globe; the pointer nudges and tilts it.
  const globeScrollY = useTransform(progress, [0, 1], [0, 150]);
  const globeScale = useTransform(progress, [0, 1], [1, 0.88]);
  const globeX = useTransform(pointer.x, [-1, 1], [26, -26]);
  const globeY = useTransform(pointer.y, [-1, 1], [18, -18]);
  const globeTilt = useTransform(pointer.x, [-1, 1], [2.2, -2.2]);

  const bandNear = useTransform(progress, [0, 1], [0, 96]);
  const bandFront = useTransform(progress, [0, 1], [0, 140]);

  const cloudSlowX = useTransform(pointer.x, [-1, 1], [30, -30]);
  const cloudFastX = useTransform(pointer.x, [-1, 1], [62, -62]);
  const cloudY = useTransform(pointer.y, [-1, 1], [15, -15]);
  const cloudScrollY = useTransform(progress, [0, 1], [0, -80]);

  const docX = useTransform(pointer.x, [-1, 1], [-40, 40]);
  const docY = useTransform(pointer.y, [-1, 1], [-26, 26]);
  const docRotate = useTransform(pointer.x, [-1, 1], [-8, 8]);
  const docScrollY = useTransform(progress, [0, 1], [0, 130]);

  const [cx, cy] = GLOBE.chinaAt;
  const [mx, my] = GLOBE.moroccoAt;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* sky */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#8ED4F0_0%,#B6E4F6_34%,#DDF1FB_60%,#EFF9FD_100%)]" />
      <div className="absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-white/55 blur-[90px]" />
      <div className="absolute left-1/4 top-10 h-[320px] w-[320px] rounded-full bg-white/35 blur-[80px]" />

      {/* clouds behind the globe */}
      <motion.div style={{ x: cloudSlowX, y: cloudScrollY }} className="absolute inset-0 z-[10]">
        <Cloud variant={2} className="absolute left-[4%] top-[13%] w-52 opacity-80 animate-drift" />
        <Cloud variant={1} className="absolute left-[44%] top-[5%] w-40 opacity-70 animate-drift [animation-delay:2.6s]" />
      </motion.div>

      {/* the corridor globe */}
      <motion.div
        style={{ x: globeX, y: globeScrollY, scale: globeScale, rotate: globeTilt }}
        /* Mobile: bottom-anchored and near-centred so the whole sphere — both
           labels included — lands in the band the copy leaves free. From sm up
           it bleeds off the right edge behind the copy column. */
        className="absolute bottom-0 right-[-2%] top-auto z-[20] w-[105vw] sm:bottom-auto sm:right-[-24%] sm:top-[9%] sm:w-[88vw] lg:right-[-13%] lg:top-[7%] lg:w-[61vw] xl:right-[-9%] xl:w-[56vw]"
      >
        <motion.div style={{ y: globeY }}>
          <svg viewBox="-80 -80 1160 1160" className="w-full drop-shadow-[0_30px_60px_rgba(4,38,59,0.22)]">
            <defs>
              <radialGradient id="ocean" cx="34%" cy="26%" r="82%">
                <stop offset="0%" stopColor="#3FAEDC" />
                <stop offset="38%" stopColor="#1785BB" />
                <stop offset="72%" stopColor="#0A5A85" />
                <stop offset="100%" stopColor="#04263B" />
              </radialGradient>
              <radialGradient id="atmos" cx="50%" cy="50%" r="50%">
                <stop offset="84%" stopColor="#5EC2E8" stopOpacity="0" />
                <stop offset="100%" stopColor="#A9DEF2" stopOpacity=".8" />
              </radialGradient>
              <linearGradient id="land" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0%" stopColor="#3FCBA4" />
                <stop offset="100%" stopColor="#12876C" />
              </linearGradient>
              <radialGradient id="sheen" cx="28%" cy="20%" r="38%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".16" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
              <clipPath id="sphere">
                <circle cx="500" cy="500" r="500" />
              </clipPath>
            </defs>

            <circle cx="500" cy="500" r="546" fill="url(#atmos)" />
            <circle cx="500" cy="500" r="500" fill="url(#ocean)" />

            <g clipPath="url(#sphere)">
              <path d={GLOBE.graticule} fill="none" stroke="#DDF1FB" strokeOpacity=".26" strokeWidth="1.8" />

              <g stroke="#0B6D57" strokeWidth="2.5" strokeLinejoin="round">
                <path d={GLOBE.china} fill="url(#land)" />
                <path d={GLOBE.morocco} fill="url(#land)" />
              </g>

              {/* the sea lane, China to Morocco */}
              <path
                id="lane"
                d={GLOBE.lane}
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity=".9"
                strokeWidth="5"
                strokeDasharray="16 20"
                strokeLinecap="round"
                className="animate-dash"
              />

              {/* factory on the China side */}
              <Puffs x={cx - 40} y={cy - 96} />
              <Puffs x={cx + 34} y={cy - 88} />
              <image href="/images/scene/factory.svg" x={cx - 140} y={cy - 82} width="280" height="145" />

              {/* arrival stack on the Morocco side */}
              <image href="/images/scene/containers.svg" x={mx - 34} y={my - 128} width="150" height="125" />
              <image href="/images/scene/truck.svg" x={mx - 46} y={my + 6} width="130" height="69" />

              {/* the ship, sailing the lane */}
              <g>
                <image href="/images/scene/ship.svg" x="-96" y="-33" width="192" height="66" />
                <animateMotion dur="30s" repeatCount="indefinite">
                  <mpath href="#lane" />
                </animateMotion>
              </g>

              <circle cx="500" cy="500" r="500" fill="url(#sheen)" />
            </g>

            <circle cx="500" cy="500" r="500" fill="none" stroke="#CBEAF8" strokeWidth="3" strokeOpacity=".55" />

            <Label x={789} y={512} text="CHINA" width={186} />
            <Label x={158} y={528} text="MOROCCO" width={244} />
          </svg>
        </motion.div>
      </motion.div>

      {/* clouds in front of the globe */}
      <motion.div style={{ x: cloudFastX, y: cloudY }} className="absolute inset-0 z-[30]">
        <Cloud variant={0} className="absolute right-[6%] top-[8%] w-56 opacity-90 animate-drift [animation-delay:1.4s]" />
        <Cloud variant={1} className="absolute left-[16%] top-[30%] w-32 opacity-95 animate-drift [animation-delay:.7s]" />
      </motion.div>

      <Gull className="absolute left-[54%] top-[20%] z-[31] w-12 animate-drift [animation-delay:1.1s]" />
      <Gull className="absolute left-[60%] top-[25%] z-[31] w-8 animate-drift [animation-delay:2.3s]" />

      {/* air freight, flying China to Morocco */}
      <motion.div
        className="absolute top-[4%] z-[41] w-40 sm:top-[13%] sm:w-52 lg:w-60"
        initial={{ x: '128vw' }}
        animate={{ x: '-40vw', y: [0, -16, 0] }}
        transition={{
          x: { duration: 32, repeat: Infinity, ease: 'linear', delay: 2 },
          y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <img
          src="/images/scene/plane.svg"
          alt=""
          className="w-full drop-shadow-[0_14px_22px_rgba(4,38,59,0.2)]"
        />
      </motion.div>

      {/* ocean the globe rises out of */}
      <WaveBand bottom="0%" height="110px" amp={22} fill="#0E6E9E" opacity={0.9} duration={15} drift={bandNear} zIndex={38} />
      <WaveBand bottom="-10%" height="150px" amp={30} fill="#083C5C" duration={11} drift={bandFront} reverse zIndex={40} />

      {/* foam crest */}
      <motion.div className="absolute inset-x-0 bottom-[-1%] z-[39]" style={{ y: bandNear }}>
        <motion.div
          className="w-[200%]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 2880 60" preserveAspectRatio="none" className="h-6 w-full">
            <path d={wavePath(26, 34, 40)} fill="none" stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>

      {/* the paperwork, closest to the viewer */}
      <motion.div
        style={{ x: docX, y: docY, rotate: docRotate }}
        className="absolute bottom-[16%] right-[5%] z-[50] hidden w-36 lg:block xl:w-44"
      >
        <motion.div style={{ y: docScrollY }}>
          <div className="animate-drift">
            <img src="/images/scene/docs.svg" alt="" className="w-full drop-shadow-[0_18px_28px_rgba(4,38,59,0.22)]" />
          </div>
        </motion.div>
      </motion.div>

      {/* readability scrim under the copy column */}
      <div className="pointer-events-none absolute inset-0 z-[52] bg-[radial-gradient(115%_76%_at_0%_40%,rgba(233,246,252,0.9)_0%,rgba(233,246,252,0.55)_34%,rgba(233,246,252,0.16)_54%,transparent_70%)]" />

      {/* Mobile: copy spans the full width, so the left-anchored radial can't
          carry it. Holds over the copy, then clears by 70% — below that the
          globe band is the subject and wants no veil at all. */}
      <div className="pointer-events-none absolute inset-0 z-[52] bg-[linear-gradient(to_bottom,rgba(233,246,252,0.72)_0%,rgba(233,246,252,0.86)_34%,rgba(233,246,252,0.72)_52%,rgba(233,246,252,0.28)_62%,rgba(233,246,252,0)_70%)] sm:hidden" />

      {/* bottom fade into the page */}
      <div className="absolute inset-x-0 bottom-0 z-[53] h-24 bg-gradient-to-t from-shell to-transparent" />
    </div>
  );
}
