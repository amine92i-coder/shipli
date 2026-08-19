import { PARTNERS } from '@/data/content';
import { useT } from '@/i18n/LangContext';

/**
 * The partner logos, as a band welded to the bottom edge of the hero.
 *
 * This used to be its own section below the hero, and that was the whole
 * problem: at 84svh the hero ended 144px above the fold and those 144px were
 * 91px of the section's own top padding followed by a headline sliced through
 * the middle. Screen real estate spent to look broken. Moved up here the same
 * pixels carry seven recognisable logos, the fold cuts the band rather than a
 * word, and a half-visible row of logos is the least ambiguous "keep scrolling"
 * signal there is — nobody thinks a page ends mid-logo.
 *
 * WHITE, and specifically `bg-white`, not `bg-shell`. The logos are opaque JPEGs
 * with pure-white backgrounds, so the band's colour is not a style choice — any
 * other value and all seven appear as visibly brighter rectangles floating on
 * it. That is also why they are not on the dark abyss the rest of the hero uses:
 * on abyss they would be seven glaring white tiles. Transparent PNGs would free
 * this up; until then, white.
 *
 * The section heading that used to sit above these ("Dealt with leading
 * companies") is gone. A centred h2 needs vertical room the hero's bottom edge
 * does not have, and the eyebrow alone carries the same meaning in one line —
 * so `t.partners.label` moves inline to the start of the band and the other two
 * strings go unused rather than being crushed into it.
 */
export function PartnerStrip() {
  const t = useT();
  // Doubled, because the marquee keyframe translates exactly -50%: the second
  // copy is what is under the viewport when the first one leaves it.
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <div
      className="relative z-20 flex h-20 shrink-0 items-center bg-white sm:h-[6.5rem]"
      data-testid="hero-partner-strip"
    >
      {/* Hidden below sm. On a phone the band is 80px tall and the logos need
          all of the width; a label there would cost two logos to say what the
          logos already say. */}
      <p className="eyebrow hidden shrink-0 pe-8 ps-5 text-sea/70 sm:block sm:ps-8 lg:ps-12">
        {t.partners.label}
      </p>

      {/* min-w-0 is load-bearing. A flex item defaults to min-width:auto, which
          means it refuses to shrink below its content — and this item's content
          is fourteen logos in a `w-max` row. Without it the band stops being a
          marquee and becomes a very wide page. */}
      {/* dir="ltr" here is a bug fix, not a preference, and it has to be on this
          element — the clipping WINDOW — rather than on the track inside it.

          The marquee rests on two physical-left assumptions: the keyframe
          translates -50%, and `pe-12` adds a fourteenth gap after the last logo
          so half the track width is exactly seven logos plus seven gaps, which
          is what makes the loop seamless.

          Under dir="rtl" both invert. It is the PARENT's direction that decides
          which way an overflowing child hangs, so an rtl window anchors the
          w-max track's RIGHT edge to its own right edge and lets it overflow
          leftward — measured: track at -971..1157 inside a 0..1156 window.
          Translating -50% from there drags the row further out of view instead
          of scrolling it through, and `pe-12` becomes padding-left, putting the
          seam at the wrong end. The band emptied to a single logo on an
          otherwise blank strip, verified in Arabic at 1280x800.

          Setting it on the track alone does nothing for this: that only changes
          the track's internal layout, not where its parent hangs it. It was
          broken in the old section too; it just used to be below the fold where
          nobody looked.

          ltr rather than a second reversed keyframe because these are logos, not
          text — they have no reading order to respect, and an `rtl:` animation
          variant would carry the same specificity as the base utility and be
          settled by Tailwind's emission order. The BAND still mirrors: the label
          swaps to the right in Arabic, because that part IS text. */}
      <div dir="ltr" className="mask-fade-x relative min-w-0 flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-12 pe-12 hover:[animation-play-state:paused]">
          {loop.map((partner, index) => (
            <img
              key={`${partner.name}-${index}`}
              src={partner.src}
              alt={partner.name}
              // Not lazy any more. These are above the fold now, and a lazy
              // image there is a band of blanks for the first paint.
              decoding="async"
              className="h-20 w-auto max-w-[190px] object-contain sm:h-[6.5rem] sm:max-w-[230px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
