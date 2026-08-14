import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MousePointer2, ShieldCheck } from 'lucide-react';
import { OceanScene } from './ocean/OceanScene';
import { HERO, STATS } from '@/data/content';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden" data-testid="section-hero">
      <OceanScene progress={scrollYProgress} />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-[55] flex min-h-[100svh] items-center pb-36 pt-28 sm:pb-44"
      >
        <div className="shell">
          <div className="max-w-2xl">
            <div className="animate-rise flex items-center gap-3">
              <span className="h-px w-9 bg-coral" />
              <p className="eyebrow text-deep">{HERO.eyebrow}</p>
            </div>

            <h1
              className="display animate-rise mt-6 text-[clamp(2.75rem,6.6vw,5.75rem)] text-abyss [animation-delay:.1s]"
              data-testid="text-hero-headline"
            >
              {HERO.headlineTop}{' '}
              <span className="relative inline-block">
                <span className="relative z-10">{HERO.headlineMark}</span>
                <span className="absolute inset-x-0 bottom-[.12em] z-0 h-[.3em] -rotate-1 rounded-full bg-coral/45" />
              </span>
              <br />
              {HERO.headlineBottom}
            </h1>

            <p className="animate-rise mt-7 max-w-xl text-base leading-7 text-deep/85 [animation-delay:.2s] sm:text-lg sm:leading-8">
              {HERO.sub}
            </p>

            <div className="animate-rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:.3s]">
              <Link to="/start" className="btn-primary group" data-testid="button-hero-start">
                {HERO.primary}
                <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="btn-ghost" data-testid="link-hero-contact">
                {HERO.secondary}
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="animate-rise mt-10 flex items-center gap-3 text-xs font-semibold text-deep [animation-delay:.4s]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sea shadow-sm">
                <ShieldCheck size={16} />
              </span>
              {HERO.assurance}
            </div>
          </div>
        </div>
      </motion.div>

      {/* stat strip riding on the water */}
      <motion.div
        style={{ opacity: copyOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-4 z-[56] sm:bottom-6"
      >
        <div className="shell">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/25 bg-white/20 backdrop-blur-md lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/25 px-4 py-3 sm:px-5 sm:py-4">
                <p className="display text-xl text-white drop-shadow-sm sm:text-2xl">{stat.value}</p>
                <p className="mt-1 font-mono text-[9px] uppercase leading-[1.35] tracking-[0.12em] text-white/90 sm:text-[10px] sm:tracking-[0.14em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: copyOpacity }}
        className="pointer-events-none absolute bottom-6 right-6 z-[57] hidden items-center gap-2 rounded-full bg-abyss/25 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white backdrop-blur lg:flex"
      >
        <MousePointer2 size={12} />
        Move · scroll to sail
      </motion.div>
    </section>
  );
}
