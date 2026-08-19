import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Boxes, Cpu, HardHat, Layers, Sofa, Sprout } from 'lucide-react';
import { CATEGORIES } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { Reveal, SectionLabel } from '../ui';

/** Positional — one icon and one photograph per entry in CATEGORIES, same order. */
const ICONS = [HardHat, Sprout, Cpu, Layers, Sofa];
const PHOTOS = [
  '/images/sections/cat-construction.jpg',
  '/images/sections/cat-agriculture.jpg',
  '/images/sections/cat-electronics.jpg',
  '/images/sections/cat-materials.jpg',
  '/images/sections/cat-interiors.jpg',
];

/**
 * Each tone carries three layers now instead of one flat fill.
 *
 * `veil` is a gradient rather than a uniform wash because the copy sits at the
 * BOTTOM of every card — `justify-between` puts it there — so the opaque end of
 * the gradient lands exactly where the text has to stay readable, and the clear
 * end lands at the top where the photograph is allowed through. That holds
 * whatever the photo underneath happens to be doing, which is what lets five
 * separately generated images share a single treatment.
 *
 * `scrim` evens out the exposure differences between those five so the grid
 * reads as a set rather than a pile. It is also the layer that lifts on hover:
 * opacity interpolates and background-image does not, so fading the scrim gives
 * a real transition where animating the gradient itself would only snap.
 *
 * Every opacity here is a step Tailwind actually ships (90/30/25). Off-scale
 * values like /85 compile to nothing at all, silently — the card would still
 * look plausible while the veil quietly did nothing.
 */
const TONES: Record<string, { text: string; scrim: string; veil: string }> = {
  sea: { text: 'text-white', scrim: 'bg-abyss/30', veil: 'from-sea via-sea/90 to-sea/25' },
  kelp: { text: 'text-white', scrim: 'bg-abyss/30', veil: 'from-kelp via-kelp/90 to-kelp/25' },
  mist: { text: 'text-abyss', scrim: 'bg-white/30', veil: 'from-mist via-mist/90 to-mist/25' },
  sand: { text: 'text-abyss', scrim: 'bg-white/30', veil: 'from-sand via-sand/90 to-sand/25' },
  deep: { text: 'text-white', scrim: 'bg-abyss/30', veil: 'from-deep via-deep/90 to-deep/25' },
};

export function Categories() {
  const t = useT();
  return (
    <section className="bg-shell py-24 sm:py-32" data-testid="section-categories">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>{t.categories.label}</SectionLabel>
              <h2 className="display mt-4 text-4xl text-abyss sm:text-5xl" data-testid="text-categories-heading">
                {t.categories.title}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-deep/70">{t.categories.body}</p>
          </div>
        </Reveal>

        {/* Five categories plus the "Something specific?" card = six, so three
            across gives two full rows with no orphan. */}
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => {
            const CategoryIcon = ICONS[index] ?? Boxes;
            const copy = t.categories.items[index];
            const tone = TONES[category.tone];
            return (
              <Reveal key={category.tone + index} delay={index * 0.08}>
                <div
                  className={`group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl p-7 transition duration-500 hover:-translate-y-1.5 ${tone.text}`}
                >
                  {/* Decorative, so alt is deliberately empty: the h3 two lines
                      below already names the category, and a screen reader
                      announcing "Agriculture solutions" twice in a row is worse
                      than not describing a photo that carries no information the
                      heading does not. */}
                  <img
                    src={PHOTOS[index]}
                    alt=""
                    loading="lazy"
                    width={800}
                    height={533}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 transition duration-500 group-hover:opacity-0 ${tone.scrim}`} />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tone.veil}`} />

                  <CategoryIcon size={26} className="relative" />
                  <div className="relative">
                    <h3 className="display text-2xl leading-tight">{copy.title}</h3>
                    <p className="mt-2 text-xs leading-5 opacity-75">{copy.note}</p>
                    {/* The hover nudge has to turn with the arrow. Rotated to
                        point up-LEFT in Arabic, an arrow still drifting a pixel
                        to the physical right on hover is travelling away from
                        its own tip. Only the x half flips: `up` is up in both
                        directions. */}
                    <ArrowUpRight
                      className="mt-4 opacity-60 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 rtl:rotate-[-90deg] rtl:group-hover:-translate-x-1"
                      size={19}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}

          <Reveal delay={CATEGORIES.length * 0.08}>
            <div className="flex min-h-[240px] flex-col justify-between rounded-3xl border border-dashed border-sea/35 bg-white p-7">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sea">
                  {t.categories.customEyebrow}
                </span>
                <h3 className="display mt-3 text-2xl leading-tight text-abyss">
                  {t.categories.customTitleA}
                  <br />
                  {t.categories.customTitleB}
                </h3>
              </div>
              <Link to="/start" className="flex items-center gap-2 text-sm font-bold text-sea transition hover:gap-3">
                {t.categories.customCta}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
