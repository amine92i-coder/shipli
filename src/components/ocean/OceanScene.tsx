import { motion, useTransform, type MotionValue } from 'framer-motion';
import { Cloud, DocCard, Gull, Plane, Port, Ship, Smoke } from './SceneParts';
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

export function OceanScene({ progress }: { progress: MotionValue<number> }) {
  const pointer = usePointer();

  // Scroll drives the voyage; the pointer nudges it.
  const shipScrollX = useTransform(progress, [0, 1], ['-4%', '34%']);
  const shipPointerX = useTransform(pointer.x, [-1, 1], ['-2.5%', '2.5%']);
  const shipY = useTransform(progress, [0, 1], [0, 46]);
  const shipScale = useTransform(progress, [0, 1], [1, 0.9]);

  const bandFar = useTransform(progress, [0, 1], [0, 30]);
  const bandMid = useTransform(progress, [0, 1], [0, 58]);
  const bandNear = useTransform(progress, [0, 1], [0, 96]);
  const bandFront = useTransform(progress, [0, 1], [0, 140]);

  const cloudSlowX = useTransform(pointer.x, [-1, 1], [28, -28]);
  const cloudFastX = useTransform(pointer.x, [-1, 1], [58, -58]);
  const cloudY = useTransform(pointer.y, [-1, 1], [14, -14]);
  const cloudScrollY = useTransform(progress, [0, 1], [0, -70]);

  const portX = useTransform(pointer.x, [-1, 1], [12, -12]);
  const portScrollY = useTransform(progress, [0, 1], [0, 24]);

  const docX = useTransform(pointer.x, [-1, 1], [-34, 34]);
  const docY = useTransform(pointer.y, [-1, 1], [-22, 22]);
  const docRotate = useTransform(pointer.x, [-1, 1], [-7, 7]);
  const docScrollY = useTransform(progress, [0, 1], [0, 130]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* sky */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#8ED4F0_0%,#B6E4F6_34%,#DDF1FB_60%,#EFF9FD_100%)]" />
      <div className="absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-white/55 blur-[90px]" />
      <div className="absolute left-1/4 top-10 h-[320px] w-[320px] rounded-full bg-white/35 blur-[80px]" />

      {/* clouds */}
      <motion.div style={{ x: cloudSlowX, y: cloudScrollY }} className="absolute inset-0">
        <Cloud variant={2} className="absolute left-[4%] top-[13%] w-52 opacity-80 animate-drift" />
        <Cloud variant={0} className="absolute right-[8%] top-[9%] w-64 opacity-90 animate-drift [animation-delay:1.4s]" />
        <Cloud variant={1} className="absolute left-[46%] top-[5%] w-40 opacity-70 animate-drift [animation-delay:2.6s]" />
      </motion.div>
      <motion.div style={{ x: cloudFastX, y: cloudY }} className="absolute inset-0">
        <Cloud variant={1} className="absolute left-[18%] top-[27%] w-32 opacity-95 animate-drift [animation-delay:.7s]" />
        <Cloud variant={2} className="absolute right-[24%] top-[31%] w-36 opacity-85 animate-drift [animation-delay:2s]" />
      </motion.div>

      {/* gulls */}
      <Gull className="absolute left-[62%] top-[22%] w-12 animate-drift [animation-delay:1.1s]" />
      <Gull className="absolute left-[68%] top-[27%] w-8 animate-drift [animation-delay:2.3s]" />

      {/* cargo plane crossing the sky */}
      <motion.div
        className="absolute top-[14%] w-40 sm:w-52"
        initial={{ x: '-30vw' }}
        animate={{ x: '130vw', y: [0, -14, 0] }}
        transition={{
          x: { duration: 30, repeat: Infinity, ease: 'linear', delay: 3 },
          y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <Plane className="w-full drop-shadow-[0_10px_18px_rgba(4,38,59,0.18)]" />
      </motion.div>

      {/* horizon haze */}
      <div className="absolute inset-x-0 bottom-[42%] h-32 bg-gradient-to-t from-mist/70 to-transparent" />

      {/* port + factory on the far shore */}
      <motion.div
        style={{ x: portX, y: portScrollY }}
        className="absolute bottom-[41%] right-[-4%] w-[260px] sm:right-[2%] sm:w-[340px] lg:w-[400px]"
      >
        <Smoke className="absolute -top-[74px] left-[13%] w-14 opacity-70" />
        <Smoke className="absolute -top-[92px] left-[21%] w-16 opacity-60" delay={1.8} />
        <Smoke className="absolute -top-[66px] left-[30%] w-12 opacity-50" delay={3.4} />
        <Port className="w-full" />
      </motion.div>

      {/* ocean body */}
      <div className="absolute inset-x-0 bottom-0 top-[58%] bg-[linear-gradient(180deg,#7FCBEA_0%,#2E9BCB_28%,#0E6E9E_62%,#083C5C_100%)]" />

      {/* shipping route */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-[30%] z-[31] h-24 w-full"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M60,20 C340,4 620,74 1140,50"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".55"
          strokeWidth="2.5"
          strokeDasharray="14 16"
          className="animate-dash"
        />
      </svg>

      <WaveBand bottom="34%" height="90px" amp={16} fill="#5EC2E8" opacity={0.85} duration={26} drift={bandFar} zIndex={32} />
      <WaveBand bottom="24%" height="120px" amp={22} fill="#1D96C9" opacity={0.9} duration={20} drift={bandMid} reverse zIndex={34} />

      {/* the ship */}
      <motion.div
        style={{ x: shipScrollX, y: shipY, scale: shipScale }}
        className="absolute bottom-[24%] left-[30%] z-[36] w-[240px] origin-bottom sm:left-[40%] sm:w-[330px] lg:w-[430px]"
      >
        <motion.div style={{ x: shipPointerX }}>
          <motion.div
            animate={{ y: [0, -9, 0], rotate: [-1.6, 1.6, -1.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Smoke className="absolute -top-[52px] left-[19%] w-10 opacity-60" delay={0.6} />
            <Ship className="w-full" />
            <div className="absolute -bottom-2 left-[6%] h-10 w-[86%] scale-y-[-1] opacity-25 blur-[6px]">
              <Ship className="w-full" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <WaveBand bottom="15%" height="150px" amp={28} fill="#0E6E9E" duration={15} drift={bandNear} zIndex={38} />
      <WaveBand bottom="-4%" height="200px" amp={34} fill="#083C5C" duration={11} drift={bandFront} reverse zIndex={40} />

      {/* foam crest */}
      <motion.div className="absolute inset-x-0 bottom-[13%] z-[39]" style={{ y: bandNear }}>
        <motion.div
          className="w-[200%]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 2880 60" preserveAspectRatio="none" className="h-6 w-full">
            <path
              d={wavePath(28, 34, 40)}
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity=".5"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* floating shipping documents */}
      <motion.div
        style={{ x: docX, y: docY, rotate: docRotate }}
        className="absolute bottom-[22%] right-[6%] z-[50] hidden w-36 lg:block xl:w-44"
      >
        <motion.div style={{ y: docScrollY }}>
          <div className="animate-drift">
            <DocCard className="w-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* readability scrim under the copy column */}
      <div className="pointer-events-none absolute inset-0 z-[52] bg-[radial-gradient(115%_76%_at_0%_40%,rgba(233,246,252,0.86)_0%,rgba(233,246,252,0.46)_36%,rgba(233,246,252,0.12)_54%,transparent_70%)]" />

      {/* mobile: copy spans the full width, so the left-anchored radial can't carry it.
          Fades out above the stat strip so the water still reads as glass behind it. */}
      <div className="pointer-events-none absolute inset-0 z-[52] bg-[linear-gradient(to_bottom,rgba(233,246,252,0.42)_0%,rgba(233,246,252,0.62)_34%,rgba(233,246,252,0.58)_62%,rgba(233,246,252,0.18)_74%,rgba(233,246,252,0)_82%)] sm:hidden" />

      {/* bottom fade into the page */}
      <div className="absolute inset-x-0 bottom-0 z-[53] h-24 bg-gradient-to-t from-shell to-transparent" />
    </div>
  );
}
