import { ArrowUpRight, MapPin } from 'lucide-react';
import { CONTACT } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { fill } from '@/i18n';
import { PageHeader, Reveal, SectionLabel } from '@/components/ui';

export default function Careers() {
  const t = useT();

  /**
   * Read straight from the dictionary rather than zipped against data/content.ts:
   * a job posting is prose end to end — title, location, contract type and blurb —
   * with no icon, route or asset to pair it with. There is nothing left to hold in
   * the data file, so the list lives entirely in the three translations.
   */
  const jobs = t.careers.jobs;

  return (
    <>
      <PageHeader eyebrow={t.careers.eyebrow} title={t.careers.title} intro={t.careers.intro} />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>{t.careers.rolesLabel}</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">
              {fill(t.careers.rolesTitle, { n: jobs.length })}
            </h2>
          </Reveal>

          <div className="mt-12 border-t border-sea/15">
            {jobs.map((job, index) => (
              <Reveal key={job.title} delay={index * 0.05}>
                <a
                  /* The subject line arrives in the applicant's own language — the
                     inbox it lands in is bilingual, the applicant's keyboard may not be. */
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
                    fill(t.careers.applySubject, { role: job.title }),
                  )}`}
                  className="group grid items-center gap-4 border-b border-sea/15 py-7 transition duration-300 hover:bg-shell md:grid-cols-[1.1fr_.9fr_auto] md:gap-8"
                >
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-abyss">{job.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-deep/70">{job.body}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-foam px-3.5 py-1.5 text-xs font-bold text-sea">
                      <MapPin size={13} />
                      {job.location}
                    </span>
                    <span className="rounded-full border border-sea/20 px-3.5 py-1.5 text-xs font-bold text-deep/70">
                      {job.type}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 justify-self-start text-sm font-bold text-sea transition group-hover:gap-3 md:justify-self-end">
                    {t.careers.apply}
                    <ArrowUpRight size={15} className="rtl:rotate-[-90deg]" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>{t.careers.valuesLabel}</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">{t.careers.valuesTitle}</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {t.careers.values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.07}>
                <div className="h-full rounded-3xl bg-white/70 p-7 backdrop-blur-sm">
                  <span className="font-mono text-xs text-sea">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-6 text-lg font-bold tracking-tight text-abyss">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-deep/75">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-abyss py-20 text-shell sm:py-24">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <Reveal>
            <SectionLabel tone="light">{t.careers.specLabel}</SectionLabel>
            <h2 className="display mt-4 max-w-xl text-3xl text-shell sm:text-4xl">{t.careers.specTitle}</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-mist/75">{t.careers.specBody}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(t.careers.specSubject)}`}
              className="btn-primary shrink-0"
            >
              {t.careers.specCta} <span dir="ltr">{CONTACT.email}</span>
              <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
