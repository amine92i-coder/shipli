import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { HIGHLIGHTS } from '@/data/content';
import { Icon, PageHeader, Reveal, SectionLabel } from '@/components/ui';
import { Presence } from '@/components/sections/Presence';
import { Cta } from '@/components/sections/Cta';
import { useT } from '@/i18n/LangContext';

/**
 * Five cards over a six-column grid: thirds, then halves. Six is the smallest
 * count that divides both ways, which is what keeps the fifth card from
 * standing alone in a row of four. The last card also spans both columns at
 * `sm`, where a 2-2-1 stack leaves the same widow.
 *
 * Positional, like every other array on this page — index 4 here is index 4 in
 * HIGHLIGHTS and in `t.about.highlights`.
 */
const HIGHLIGHT_SPAN = [
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-3',
  'sm:col-span-2 lg:col-span-3',
];

export default function About() {
  const t = useT();
  return (
    <>
      <PageHeader eyebrow={t.about.eyebrow} title={t.about.title} intro={t.about.intro} />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <Reveal>
            <SectionLabel>{t.about.whoLabel}</SectionLabel>
            <h2 className="display mt-4 text-3xl text-abyss sm:text-4xl">{t.about.whoTitle}</h2>
            <p className="mt-6 text-base leading-8 text-deep/75">{t.about.whoBody}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {t.about.capabilities.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-deep">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foam text-sea">
                    <Check size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn-primary mt-9">
              {t.about.whoCta}
              <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-sea/10">
              <img
                src="/images/gallery/gallery-6.jpg"
                alt={t.about.photoAlt}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/85 to-transparent p-7 text-shell">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky">{t.about.photoKicker}</p>
                <p className="display mt-2 text-2xl">{t.about.photoCaption}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="highlights" className="scroll-mt-24 bg-foam py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>{t.about.highlightsLabel}</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">{t.about.highlightsTitle}</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {HIGHLIGHTS.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.07} className={HIGHLIGHT_SPAN[index]}>
                <div className="group h-full rounded-3xl bg-white p-7 transition duration-500 hover:-translate-y-1.5">
                  {/* An icon, not a numeral — see HIGHLIGHTS in data/content.ts. */}
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foam text-sea transition duration-300 group-hover:bg-sea group-hover:text-white">
                    <Icon name={item.icon} size={19} />
                  </span>
                  <h3 className="mt-6 text-base font-bold tracking-tight text-abyss">
                    {t.about.highlights[index].title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-deep/70">{t.about.highlights[index].body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="strategy" className="scroll-mt-24 bg-abyss py-20 text-shell sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel tone="light">{t.about.strategyLabel}</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-shell sm:text-5xl">{t.about.strategyTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-mist/80">{t.about.strategyBody}</p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {t.about.strategy.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <div className="h-full rounded-3xl border border-white/[0.12] bg-white/[0.06] p-7 backdrop-blur-sm">
                  <span className="font-mono text-xs text-sky">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-6 text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-mist/75">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="philosophy" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>{t.about.philosophyLabel}</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">{t.about.philosophyTitle}</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {t.about.philosophy.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <div className="border-t border-sea/20 pt-6">
                  <h3 className="text-xl font-bold tracking-tight text-abyss">{item.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-deep/70">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-shell py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>{t.about.whyLabel}</SectionLabel>
            <h2 className="display mt-4 text-4xl text-abyss sm:text-5xl">{t.about.whyTitle}</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.about.why.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="card h-full p-7 hover:-translate-y-1.5 hover:border-sea/30">
                  <h3 className="text-base font-bold tracking-tight text-abyss">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-deep/70">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Presence />
      <Cta />
    </>
  );
}
