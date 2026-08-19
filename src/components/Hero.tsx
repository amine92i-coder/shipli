import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, ShieldCheck } from 'lucide-react';
import { CrossingScene } from './hero/CrossingScene';
import { PartnerStrip } from './hero/PartnerStrip';
import { useT } from '@/i18n/LangContext';

export function Hero() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    /* Deliberately TALLER than the viewport, which is the opposite of both
       previous attempts and is the point.

       At 100svh the hero ended on a clean edge exactly at the fold, which looks
       intentional and tells the reader nothing — a dark band that stops where
       the screen stops reads as the whole page. At 84svh it ended 144px early,
       and those 144px were 91px of the next section's top padding followed by
       its headline sliced through the middle. Both spent the same screen; only
       one of them was even trying to say "there is more".

       So the height is now derived from what should be CUT by the fold rather
       than picked as a percentage. The partner strip is 6.5rem (5rem on a
       phone) and the section overshoots the viewport by 2.5rem (2rem), so the
       strip straddles the fold with about 60% of it showing. A row of logos
       sliced along its bottom is unmistakable: nobody has ever thought a page
       ended mid-logo.

       The two reasons full height failed before are both gone. "Empty water
       below the copy" was fixed by the scene's xMidYMax anchoring, which settles
       the land on the bottom edge and puts slack above it rather than below;
       "no sign there was a page under it" is what the strip is for.

       min-h is for a phone held sideways, where svh is about 330px and the
       headline alone would fill it. There the hero runs past the fold rather
       than crushing its own contents — and now it also has a strip to fit, so
       the floor went up with it. */
    <section
      ref={ref}
      className="relative flex h-[calc(100svh+2rem)] min-h-[35rem] flex-col overflow-hidden bg-abyss text-shell sm:h-[calc(100svh+2.5rem)] sm:min-h-[38rem]"
      data-testid="section-hero"
    >
      {/* Everything dark lives in here, and the strip is its sibling. The scene
          is `absolute inset-0`, so without this wrapper it would paint straight
          over the logo band — inset-0 of the SECTION includes the strip.
          `flex-1` also means the strip's height comes off the scene rather than
          off the bottom of the page: the section grows by exactly the overshoot,
          not by the strip. */}
      <div className="relative flex-1 overflow-hidden">
        {/* The scene is the background, not a band below the copy. It covers
            this area at every ratio (the ocean is object-cover, the meaningful
            geometry is an SVG at "meet"), so there is nothing that can be cut
            off at the fold. */}
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

        {/* The scroll cue.

            Decorative and aria-hidden, not a button. A screen reader user is
            already at the top of a document and does not need to be told it
            continues; announcing it would be noise, and making it focusable
            would put a control that does nothing new ahead of the two real
            calls to action. It also stays out of the i18n dictionaries — a
            chevron needs no translation, which is why it beat the labelled
            version.

            Centred on the scene, not on the section, so it sits above the strip
            rather than on it.

            WIDE FRAME ONLY, and the query is min-aspect-ratio:1/1 because that
            is the exact expression CrossingScene uses to choose between its two
            layouts — this is one condition, written twice, and it should stay
            that way. The tall frame runs its sea lane along the bottom edge, so
            a mark pinned to the bottom centre lands directly on the container
            ship. Verified at 390x844: the badge sat on the hull. There is no
            better spot on a phone either — above the lane is the copy — and a
            phone is the one device where nobody needs to be told to scroll.

            Also hidden below 621px tall: by then the copy has already dropped
            its sub-paragraph and its assurance line, and the last thing that
            space should go to is an ornament.

            Two rings rather than one glyph — the outer circle gives the
            chevron a shape to sit in over moving water, where a bare stroke
            can land on a bright wave and disappear. */}
        <div
          className="animate-nudge absolute inset-x-0 bottom-5 z-20 hidden justify-center [@media(min-aspect-ratio:1/1)_and_(min-height:621px)]:flex"
          aria-hidden="true"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-abyss/30 backdrop-blur-sm">
            <ChevronDown size={16} className="text-mist" />
          </span>
        </div>
      </div>

      {/* The band the fold is meant to cut. See PartnerStrip. */}
      <PartnerStrip />
    </section>
  );
}
