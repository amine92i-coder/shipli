import { PARTNERS } from '@/data/content';
import { Reveal, SectionLabel } from '../ui';

export function Partners() {
  const loop = [...PARTNERS, ...PARTNERS];
  return (
    <section className="relative border-y border-sea/10 bg-white py-12 sm:py-16" data-testid="section-partners">
      <div className="shell">
        <Reveal className="flex flex-col gap-2 text-center">
          <SectionLabel>They trust us</SectionLabel>
          <h2 className="display text-2xl text-abyss sm:text-3xl">Dealt with leading companies</h2>
          <p className="mx-auto max-w-md text-sm leading-6 text-deep/70">
            Carriers, manufacturers and institutions we work alongside on the Morocco–China corridor.
          </p>
        </Reveal>
      </div>

      <div className="mask-fade-x relative mt-10 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-14 pr-14 hover:[animation-play-state:paused]">
          {loop.map((partner, index) => (
            <img
              key={`${partner.name}-${index}`}
              src={partner.src}
              alt={partner.name}
              loading="lazy"
              className="h-16 w-auto max-w-[180px] object-contain opacity-60 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 sm:h-20"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
