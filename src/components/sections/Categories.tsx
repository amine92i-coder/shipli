import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Boxes, Cpu, HardHat, Layers, Sofa, Sprout } from 'lucide-react';
import { CATEGORIES } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { Reveal, SectionLabel } from '../ui';

/** Positional — one icon per entry in CATEGORIES, in the same order. */
const ICONS = [HardHat, Sprout, Cpu, Layers, Sofa];
const TONES: Record<string, string> = {
  sea: 'bg-sea text-white',
  kelp: 'bg-kelp text-white',
  mist: 'bg-mist text-abyss',
  sand: 'bg-sand text-abyss',
  deep: 'bg-deep text-white',
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
            return (
              <Reveal key={category.tone + index} delay={index * 0.08}>
                <div
                  className={`group flex min-h-[240px] flex-col justify-between rounded-3xl p-7 transition duration-500 hover:-translate-y-1.5 ${
                    TONES[category.tone]
                  }`}
                >
                  <CategoryIcon size={26} />
                  <div>
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
