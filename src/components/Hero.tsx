import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { CrossingScene } from './hero/CrossingScene';
import { useT } from '@/i18n/LangContext';

export function Hero() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    /* 84svh, not 100. A full-height hero spent its last couple of hundred pixels
       on empty water below the copy and gave no sign there was a page under it;
       this ends above the fold, so the next section's top edge is always
       showing.

       Shortening it is also what lets the land grow. The scene fits by the
       tighter of width and height, so a 16:9 frame inside a 2.1:1 section would
       have fitted by HEIGHT and shrunk every landmass by about a sixth. The
       frame was reshaped to match (1600x780, see build-countries.mjs), which
       buys that scale back before the countries are enlarged on top of it.

       min-h is for a phone held sideways, where 84svh is about 330px and the
       headline alone would fill it. There the hero is allowed to run past the
       fold rather than crush its own contents. */
    <section
      ref={ref}
      className="relative flex h-[84svh] min-h-[30rem] flex-col overflow-hidden bg-abyss text-shell"
      data-testid="section-hero"
    >
      {/* The scene is the background, not a band below the copy. It covers the
          section at every ratio (the ocean is object-cover, the meaningful
          geometry is an SVG at "meet"), so there is nothing that can be cut off
          at the fold. */}
      <CrossingScene progress={scrollYProgress} />

      {/* Pinned under the header rather than centred in the section.
          Centring made the copy's position a function of section height, so
          every viewport needed its own negative-margin correction to keep the
          block clear of Morocco — six media variants, each measured, and each
          only about half as effective as its value suggested (a negative margin
          on a child of a justify-center column moves the block by roughly half
          the margin). Pinning puts the copy in the same place on every desktop
          viewport, and leaves one thing to check instead of six: how far up
          Morocco climbs as the section gets shorter.

          The pad is a clamp rather than a media ladder for the same reason — it
          tracks viewport height continuously, and its 88px floor is what clears
          the 74px fixed header on the shortest screens. */}
      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-20 w-full pt-[clamp(88px,14svh,132px)]"
      >
        <div className="shell">
          {/* Narrowed on a landscape phone so the block clears China sideways:
              the two countries sit at opposite corners, so the copy has to give
              up width there, not height.

              rtl:ms-auto is the one place on the site where the layout must NOT
              mirror. Everything else here is text, and text follows the reader;
              this block is positioned against a MAP. China is drawn in the upper
              right and Morocco in the lower left because that is where they are,
              and no reading direction moves them. Left to mirror normally the
              Arabic copy landed on top of China — headline over the red flag,
              buttons over the container ship (measured: the block ran x=656–1232
              at 1280 wide, China starts around x=864).

              margin-inline-start:auto pushes the block to the inline END, which
              in RTL is the physical left — the open water the copy was always
              written to sit on. The type inside still sets right-to-left, so the
              paragraph reads correctly; only the column stays put. */}
          <div className="max-w-xl rtl:ms-auto [@media(max-width:900px)_and_(max-height:620px)]:max-w-md">
            <div className="animate-rise flex items-center gap-3">
              <span className="h-px w-9 bg-coral" />
              <p className="eyebrow text-sky">{t.hero.eyebrow}</p>
            </div>

            {/* Three relief bands, all mutually exclusive so no two can ever
                match at once — these are arbitrary media variants of equal
                specificity, so an overlap would be settled by Tailwind's
                emission order rather than by intent.

                >=901 wide and <=820 tall is the short LAPTOP (a 1280x800 or a
                1280x700 window). It has width to spare and no height: the
                section shrinks with the viewport while Morocco's north coast
                climbs toward the copy, and at full rhythm the two meet. Type and
                gaps tighten; nothing is dropped, because once it is smaller
                there is room for all of it.

                <=900 wide and 621-720 tall is the short portrait phone (an SE,
                an 8) — the same tightening, one step further.

                <=900 wide and <=620 tall is a phone on its side. The sub goes,
                leaving the headline and the two buttons, which is a complete
                message on its own; a phone held sideways is not a posture anyone
                reads a paragraph in.

                Height alone cannot separate these: a 1280x700 window and a
                375x667 phone are both "short", and gating on height alone put a
                25.6px headline on the laptop. Only the phones are short AND
                narrow. */}
            <h1
              className="display animate-rise mt-5 text-[clamp(1.8rem,3.1vw,2.5rem)] leading-[1.08] text-shell [animation-delay:.1s] [@media(min-width:901px)_and_(max-height:820px)]:mt-3 [@media(min-width:901px)_and_(max-height:820px)]:text-[1.75rem] [@media(max-width:900px)_and_(max-height:620px)]:mt-2 [@media(max-width:900px)_and_(max-height:620px)]:text-[1.4rem] [@media(max-width:900px)_and_(min-height:621px)_and_(max-height:720px)]:mt-3 [@media(max-width:900px)_and_(min-height:621px)_and_(max-height:720px)]:text-[1.6rem]"
              data-testid="text-hero-headline"
            >
              <span className="block text-mist/60">{t.hero.lineOneLead}</span>
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">{t.hero.lineOneMark}</span>
                <span className="absolute inset-x-0 bottom-[.1em] z-0 h-[.3em] -rotate-1 rounded-full bg-coral/50" />
              </span>
              <span className="mt-3 block text-mist/60 [@media(max-height:820px)]:mt-1">
                {t.hero.lineTwoLead}
              </span>
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">{t.hero.lineTwoMark}</span>
                <span className="absolute inset-x-0 bottom-[.1em] z-0 h-[.3em] rotate-1 rounded-full bg-kelp/55" />
              </span>
            </h1>

            <p className="animate-rise mt-6 text-[15px] leading-7 text-mist/80 [animation-delay:.2s] [@media(min-width:901px)_and_(max-height:820px)]:mt-3.5 [@media(min-width:901px)_and_(max-height:820px)]:text-[14px] [@media(min-width:901px)_and_(max-height:820px)]:leading-6 [@media(max-width:900px)_and_(max-height:620px)]:hidden [@media(max-width:900px)_and_(min-height:621px)_and_(max-height:720px)]:mt-2.5 [@media(max-width:900px)_and_(min-height:621px)_and_(max-height:720px)]:text-[14px] [@media(max-width:900px)_and_(min-height:621px)_and_(max-height:720px)]:leading-6">
              {t.hero.sub}
            </p>

            <div className="animate-rise mt-7 flex flex-wrap items-center gap-3 [animation-delay:.3s] [@media(min-width:901px)_and_(max-height:820px)]:mt-5 [@media(max-width:900px)_and_(max-height:620px)]:mt-3 [@media(max-width:900px)_and_(min-height:621px)_and_(max-height:720px)]:mt-4">
              <Link to="/start" className="btn-primary group" data-testid="button-hero-start">
                {t.hero.primary}
                <ArrowRight size={17} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-abyss/30 px-6 py-3.5 text-sm font-bold text-shell backdrop-blur-sm transition duration-300 hover:border-sky/70 hover:bg-white/10"
                data-testid="link-hero-contact"
              >
                {t.hero.secondary}
                <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
              </Link>
            </div>

            {/* The lane facts that used to sit here — distance, days at sea,
                agents in between — are gone. The scene already carries the
                distance, and a row of 10px monospace under the buttons was the
                first thing squeezed out on every short viewport anyway. The
                assurance line stays: it is a claim, not decoration. */}
            <div className="animate-rise mt-6 flex items-center gap-2 text-[11.5px] font-semibold text-mist/70 [animation-delay:.4s] [@media(max-height:820px)]:mt-4 [@media(max-width:900px)_and_(max-height:620px)]:hidden">
              <ShieldCheck size={14} className="shrink-0 text-sky" />
              {t.hero.assurance}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
