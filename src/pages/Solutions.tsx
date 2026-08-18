import { Link } from 'react-router-dom';
import { ArrowUpRight, Calculator, Check } from 'lucide-react';
import { SERVICES } from '@/data/content';
import { Icon, PageHeader, Reveal, SectionLabel } from '@/components/ui';
import { Process } from '@/components/sections/Process';
import { Faq } from '@/components/sections/Faq';
import { Cta } from '@/components/sections/Cta';
import { useT } from '@/i18n/LangContext';

export default function Solutions() {
  const t = useT();
  return (
    <>
      <PageHeader eyebrow={t.solutions.eyebrow} title={t.solutions.title} intro={t.solutions.intro} />

      <section id="sourcing" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>{t.solutions.oneLabel}</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">{t.solutions.oneTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-deep/75">{t.solutions.oneBody}</p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.06}>
                <div className="card group h-full p-7 hover:-translate-y-1.5 hover:border-sea/30">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foam text-sea transition duration-300 group-hover:bg-sea group-hover:text-white">
                    <Icon name={service.icon} size={19} />
                  </span>
                  <h3 className="mt-6 text-lg font-bold tracking-tight text-abyss">
                    {t.solutions.services[index].title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-deep/70">{t.solutions.services[index].body}</p>
                  <Link
                    to="/start"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sea transition hover:gap-3"
                  >
                    {t.solutions.quoteCta}
                    <ArrowUpRight size={15} className="rtl:rotate-[-90deg]" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="branded" className="scroll-mt-24 overflow-hidden bg-sand py-20 sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_.85fr] lg:items-center">
          <Reveal>
            <SectionLabel>{t.solutions.twoLabel}</SectionLabel>
            <h2 className="display mt-4 max-w-xl text-4xl text-abyss sm:text-5xl">{t.solutions.twoTitle}</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-deep/80">{t.solutions.twoBody}</p>
            <ul className="mt-8 space-y-3">
              {t.solutions.brandSteps.map((step) => (
                <li key={step} className="flex items-start gap-3 text-sm leading-6 text-deep">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-sea">
                    <Check size={13} />
                  </span>
                  {step}
                </li>
              ))}
            </ul>
            <Link to="/start" className="btn-primary mt-9">
              {t.solutions.twoCta}
              <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-abyss/10">
              <img
                src="/images/gallery/gallery-7.jpg"
                alt={t.solutions.twoPhotoAlt}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* A tool, not a third solution — so it gets a band rather than its own
          numbered section, sitting where the price question naturally lands. */}
      <section className="relative overflow-hidden bg-abyss py-16 text-shell sm:py-20">
        <div className="grid-lines absolute inset-0 opacity-[0.08]" />
        <div className="absolute -end-24 -top-20 h-72 w-72 rounded-full bg-sea/30 blur-[110px]" />
        <div className="shell relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal>
            <SectionLabel tone="light">{t.solutions.calcLabel}</SectionLabel>
            <h2 className="display mt-4 max-w-lg text-3xl text-shell sm:text-4xl">{t.solutions.calcTitle}</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-mist/75">{t.solutions.calcBody}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/calculator"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-bold text-abyss transition duration-300 hover:-translate-y-0.5"
              data-testid="link-solutions-calculator"
            >
              <Calculator size={16} />
              {t.solutions.calcCta}
            </Link>
          </Reveal>
        </div>
      </section>

      <Process />
      <Faq limit={5} />
      <Cta />
    </>
  );
}
