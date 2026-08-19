import { PROCESS } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { Icon, Reveal, SectionLabel } from '../ui';

/** Positional — one photograph per entry in PROCESS, in the same order. */
const PHOTOS = [
  '/images/sections/step-request.jpg',
  '/images/sections/step-matching.jpg',
  '/images/sections/step-contract-morocco.jpg',
  '/images/sections/step-contract-china.jpg',
  '/images/sections/step-inspection.jpg',
  '/images/sections/step-shipping.jpg',
];

export function Process() {
  const t = useT();
  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,#04263B_0%,#083C5C_100%)] py-24 text-shell sm:py-32"
      data-testid="section-process"
    >
      <div className="grid-lines absolute inset-0 opacity-[0.07]" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sea/30 blur-[120px]" />

      <div className="shell relative">
        <Reveal>
          <SectionLabel tone="light">{t.process.label}</SectionLabel>
        </Reveal>
        <div className="mt-4 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <Reveal>
            <h2 className="display text-4xl text-shell sm:text-5xl" data-testid="text-process-heading">
              {t.process.title}
            </h2>
            <p className="mt-6 max-w-sm text-base leading-8 text-mist/80">{t.process.body}</p>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((step, index) => (
              <Reveal key={step.icon} delay={index * 0.07}>
                <div
                  className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:border-sky/50 hover:bg-white/[0.1]"
                  data-testid={`card-process-${index + 1}`}
                >
                  {/* A band rather than a full-bleed background. These cards are
                      about 240px wide at desktop, and a photograph veiled hard
                      enough to keep three lines of body copy legible over it
                      would read as mud at that size — all cost, no picture.
                      Banding it means the image is shown at full strength and
                      the type never sits on top of it at all.

                      The step number and icon do overlay the photo, but they are
                      two glyphs on a darkened top edge, not a paragraph.

                      Taller below `sm` because the band is a fixed height across
                      a card whose width is not: one column at 375px makes it
                      roughly 3:1, which crops away half of a 3:2 photograph,
                      while three columns at desktop leave it near 2:1. h-40
                      brings the mobile crop back in line with the desktop one
                      instead of letting the single-column layout letterbox it. */}
                  <div className="relative h-40 overflow-hidden sm:h-28">
                    <img
                      src={PHOTOS[index]}
                      alt=""
                      loading="lazy"
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-abyss/20 to-abyss/40" />
                    {/* Pinned to the band rather than pulled up into it with a
                        negative margin: the row then owns its own position
                        instead of depending on the band's height and the body's
                        padding cancelling out to the right number. px is
                        symmetric, so this needs no RTL variant. */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-3">
                      <span className="font-mono text-xs text-sky">{String(index + 1).padStart(2, '0')}</span>
                      <Icon name={step.icon} size={19} className="text-coral" />
                    </div>
                  </div>

                  <div className="p-6 pt-5">
                    <h3 className="text-base font-bold leading-tight tracking-tight">
                      {t.process.steps[index].title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-mist/75">{t.process.steps[index].body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
