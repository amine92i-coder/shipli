import { Fragment } from 'react';
import { ArrowRight, BadgeCheck, FileCheck2, Scale } from 'lucide-react';
import { Reveal, SectionLabel } from '../ui';

const PILLARS = [
  {
    tag: '01 / Morocco',
    icon: FileCheck2,
    title: 'Legal contract in Morocco',
    body: 'Before anything moves, SHIPLI signs a legally binding contract with you, drafted by our own lawyers in Morocco. SHIPLI is responsible for your product and your money.',
  },
  {
    tag: '02 / China',
    icon: Scale,
    title: 'Legal contract in China',
    body: 'Our China-based company signs directly with the factory under Chinese law — the only structure that is actually enforceable in China.',
  },
];

export function Trust() {
  return (
    <section className="relative overflow-hidden bg-sand py-24 sm:py-32" data-testid="section-trust">
      <div className="dot-grid absolute -right-24 top-0 h-full w-1/2 opacity-25" />

      <div className="shell relative">
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel>The safety architecture</SectionLabel>
            <h2 className="display mt-4 text-4xl text-abyss sm:text-6xl" data-testid="text-trust-heading">
              How SHIPLI built trust and safety
            </h2>
            <p className="mt-5 text-lg font-semibold text-deep">How we make contracts in Morocco and China.</p>
            <p className="mt-4 max-w-xl text-base leading-8 text-deep/80">
              With SHIPLI, you only ever worry about two things: receiving your product, and your money. Everything
              else is on us.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
          {PILLARS.map((pillar, index) => (
            <Fragment key={pillar.title}>
              <Reveal delay={index * 0.1}>
                <div className="h-full rounded-3xl border border-abyss/10 bg-white/55 p-7 backdrop-blur-sm">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-deep/60">{pillar.tag}</span>
                  <pillar.icon className="mt-8 text-sea" size={28} />
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-abyss">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-deep/80">{pillar.body}</p>
                </div>
              </Reveal>
              <ArrowRight className="mx-auto hidden shrink-0 text-abyss/35 lg:block" />
            </Fragment>
          ))}

          <Reveal delay={0.2}>
            <div className="flex h-full flex-col justify-center rounded-3xl bg-abyss p-7 text-shell">
              <BadgeCheck className="text-sky" size={28} />
              <h3 className="mt-5 text-xl font-bold tracking-tight">Protected customer</h3>
              <p className="mt-3 text-sm leading-7 text-mist/80">
                Two contracts. Two countries. One company standing behind both.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
