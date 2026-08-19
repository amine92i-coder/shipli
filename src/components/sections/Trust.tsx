import { Fragment } from 'react';
import { ArrowRight, BadgeCheck, FileCheck2, Scale } from 'lucide-react';
import { useT } from '@/i18n/LangContext';
import { Reveal, SectionLabel } from '../ui';

/** Icons and photographs only. The prose lives in the dictionaries, zipped by position. */
const PILLAR_ICONS = [FileCheck2, Scale];
const PILLAR_PHOTOS = ['/images/sections/trust-morocco.jpg', '/images/sections/trust-china.jpg'];

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

        {/* items-stretch, not items-center. Three cards whose body copy runs to
            different lengths were previously each sized to their own content and
            floated to a common centre line; once every card carries a photograph
            of a fixed ratio at the top, mismatched heights read as misalignment
            rather than as rhythm. Stretching them makes the image bands line up
            across the row, which is the whole point of banding them.

            The connector arrows are grid children too, so they have to opt out
            of the stretch or they grow to full card height. */}
        <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {t.trust.pillars.map((pillar, index) => {
            const PillarIcon = PILLAR_ICONS[index];
            return (
              <Fragment key={pillar.tag}>
                <Reveal delay={index * 0.1} className="h-full">
                  {/* aspect-[3/2] matches what the generator produced, so these
                      are shown uncropped. That matters more here than elsewhere:
                      this section's claim is that real contracts get signed in
                      both countries, and cropping into the frame or burying it
                      under a colour veil would throw away the evidence the
                      picture is there to provide. */}
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-abyss/10 bg-white/55 backdrop-blur-sm">
                    <img
                      src={PILLAR_PHOTOS[index]}
                      alt={pillar.alt}
                      loading="lazy"
                      width={800}
                      height={533}
                      className="aspect-[3/2] w-full object-cover"
                    />
                    <div className="p-7">
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-deep/60">
                        {pillar.tag}
                      </span>
                      <PillarIcon className="mt-6 text-sea" size={28} />
                      <h3 className="mt-5 text-xl font-bold tracking-tight text-abyss">{pillar.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-deep/80">{pillar.body}</p>
                    </div>
                  </div>
                </Reveal>
                <ArrowRight className="mx-auto hidden shrink-0 self-center text-abyss/35 lg:block rtl:rotate-180" />
              </Fragment>
            );
          })}

          <Reveal delay={0.2} className="h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-abyss text-shell">
              <img
                src="/images/sections/trust-protected.jpg"
                alt={t.trust.protectedAlt}
                loading="lazy"
                width={800}
                height={533}
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="flex flex-1 flex-col justify-center p-7">
                <BadgeCheck className="text-sky" size={28} />
                <h3 className="mt-5 text-xl font-bold tracking-tight">{t.trust.protectedTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-mist/80">{t.trust.protectedBody}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
