import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ADVANTAGES } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { Icon, Reveal, SectionLabel } from '../ui';

export function Advantage() {
  const t = useT();
  return (
    <section
      id="advantage"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#F5FAFD_0%,#E4F3FA_100%)] py-24 sm:py-32"
      data-testid="section-advantage"
    >
      <div className="absolute -start-40 top-20 h-[420px] w-[420px] rounded-full bg-sky/20 blur-[110px]" />
      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr]">
          <Reveal>
            <SectionLabel>{t.advantage.label}</SectionLabel>
            <h2 className="display mt-4 max-w-sm text-4xl text-abyss sm:text-5xl" data-testid="text-advantage-heading">
              {t.advantage.title}
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-deep/75">{t.advantage.body}</p>
            <Link to="/start" className="btn-primary mt-8">
              {t.advantage.cta}
              <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
            </Link>

            {/* Balances the six-row list opposite. Hidden below lg, where the
                columns stack and this would only push the list further down. */}
            <figure className="relative mt-10 hidden overflow-hidden rounded-3xl lg:block">
              <img
                src="/images/gallery/gallery-2.jpg"
                alt={t.advantage.figureAlt}
                loading="lazy"
                width={736}
                height={736}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/85 to-transparent p-5 font-mono text-[10px] uppercase tracking-[0.16em] text-shell">
                {t.advantage.figureCaption}
              </figcaption>
            </figure>
          </Reveal>

          <div className="border-t border-sea/15">
            {ADVANTAGES.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="group grid gap-4 border-b border-sea/15 py-6 sm:grid-cols-[44px_1fr_1.05fr] sm:items-center">
                  <span className="font-mono text-xs text-sea">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sea shadow-sm transition duration-300 group-hover:bg-coral group-hover:text-abyss">
                      <Icon name={item.icon} size={17} />
                    </span>
                    <h3 className="text-[15px] font-bold leading-snug tracking-tight text-abyss">
                      {t.advantage.items[index].title}
                    </h3>
                  </div>
                  <p className="text-sm leading-6 text-deep/70">{t.advantage.items[index].body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <p className="display mt-14 max-w-3xl border-s-2 border-coral ps-6 text-2xl leading-snug text-deep sm:text-3xl">
            {t.advantage.quote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
