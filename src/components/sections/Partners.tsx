import { PARTNERS } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { Reveal, SectionLabel } from '../ui';

export function Partners() {
  const t = useT();
  const loop = [...PARTNERS, ...PARTNERS];
  return (
    <section className="relative border-y border-sea/10 bg-white py-12 sm:py-16" data-testid="section-partners">
      <div className="shell">
        <Reveal className="flex flex-col gap-2 text-center">
          <SectionLabel>{t.partners.label}</SectionLabel>
          <h2 className="display text-2xl text-abyss sm:text-3xl">{t.partners.title}</h2>
          <p className="mx-auto max-w-md text-sm leading-6 text-deep/70">{t.partners.body}</p>
        </Reveal>
      </div>

      <div className="mask-fade-x relative mt-10 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-14 pe-14 hover:[animation-play-state:paused]">
          {loop.map((partner, index) => (
            <img
              key={`${partner.name}-${index}`}
              src={partner.src}
              alt={partner.name}
              loading="lazy"
              className="h-24 w-auto max-w-[260px] object-contain transition duration-500 hover:scale-105 sm:h-28 lg:h-32"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
