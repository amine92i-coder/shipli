import { Fragment } from 'react';
import { ArrowRight, BadgeCheck, FileCheck2, Scale } from 'lucide-react';
import { useT } from '@/i18n/LangContext';
import { Reveal, SectionLabel } from '../ui';

/** Icons only. The prose lives in the dictionaries, zipped by position. */
const PILLAR_ICONS = [FileCheck2, Scale];

export function Trust() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-sand py-24 sm:py-32" data-testid="section-trust">
      <div className="dot-grid absolute -end-24 top-0 h-full w-1/2 opacity-25" />

      <div className="shell relative">
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel>{t.trust.label}</SectionLabel>
            <h2 className="display mt-4 text-4xl text-abyss sm:text-6xl" data-testid="text-trust-heading">
              {t.trust.title}
            </h2>
            <p className="mt-5 text-lg font-semibold text-deep">{t.trust.lead}</p>
            <p className="mt-4 max-w-xl text-base leading-8 text-deep/80">{t.trust.body}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
          {t.trust.pillars.map((pillar, index) => {
            const PillarIcon = PILLAR_ICONS[index];
            return (
              <Fragment key={pillar.tag}>
                <Reveal delay={index * 0.1}>
                  <div className="h-full rounded-3xl border border-abyss/10 bg-white/55 p-7 backdrop-blur-sm">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-deep/60">{pillar.tag}</span>
                    <PillarIcon className="mt-8 text-sea" size={28} />
                    <h3 className="mt-5 text-xl font-bold tracking-tight text-abyss">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-deep/80">{pillar.body}</p>
                  </div>
                </Reveal>
                <ArrowRight className="mx-auto hidden shrink-0 text-abyss/35 lg:block rtl:rotate-180" />
              </Fragment>
            );
          })}

          <Reveal delay={0.2}>
            <div className="flex h-full flex-col justify-center rounded-3xl bg-abyss p-7 text-shell">
              <BadgeCheck className="text-sky" size={28} />
              <h3 className="mt-5 text-xl font-bold tracking-tight">{t.trust.protectedTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-mist/80">{t.trust.protectedBody}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
