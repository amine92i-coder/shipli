import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useT } from '@/i18n/LangContext';
import { PageHeader, Reveal, SectionLabel } from '@/components/ui';
import { LandedCostCalculator } from '@/components/LandedCostCalculator';
import { Cta } from '@/components/sections/Cta';

export default function Calculator() {
  const t = useT();

  return (
    <>
      <PageHeader eyebrow={t.calculator.eyebrow} title={t.calculator.title} intro={t.calculator.intro} />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F5FAFD_0%,#E4F3FA_100%)] py-16 sm:py-24">
        <div className="absolute -start-32 top-40 h-[420px] w-[420px] rounded-full bg-sky/20 blur-[110px]" />
        <div className="shell relative">
          <LandedCostCalculator />
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr]">
            <Reveal>
              <SectionLabel>{t.calculator.notesLabel}</SectionLabel>
              <h2 className="display mt-4 max-w-sm text-4xl text-abyss sm:text-5xl">{t.calculator.notesTitle}</h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-deep/75">{t.calculator.notesBody}</p>

              <figure className="relative mt-9 hidden overflow-hidden rounded-3xl lg:block">
                <img
                  src="/images/gallery/gallery-14.jpg"
                  alt={t.calculator.notesPhotoAlt}
                  loading="lazy"
                  width={1200}
                  height={1600}
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/85 to-transparent p-5 font-mono text-[10px] uppercase tracking-[0.16em] text-shell">
                  {t.calculator.notesPhotoCaption}
                </figcaption>
              </figure>

              <Link to="/start" className="btn-primary mt-9">
                {t.calculator.notesCta}
                <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
              </Link>
            </Reveal>

            <div className="border-t border-sea/15">
              {t.calculator.notes.map((note, index) => (
                <Reveal key={note.title} delay={index * 0.06}>
                  <div className="grid gap-3 border-b border-sea/15 py-7 sm:grid-cols-[52px_1fr]">
                    {/* Numbered here rather than in the dictionary: "01" is the same
                        in all three languages, and deriving it means a note cannot be
                        inserted without renumbering the ones below it. */}
                    <span className="font-mono text-xs text-sea">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-[15px] font-bold leading-snug tracking-tight text-abyss">{note.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-deep/70">{note.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
