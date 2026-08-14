import { PROCESS } from '@/data/content';
import { Icon, Reveal, SectionLabel } from '../ui';

export function Process() {
  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,#04263B_0%,#083C5C_100%)] py-24 text-shell sm:py-32"
      data-testid="section-process"
    >
      <div className="grid-lines absolute inset-0 opacity-[0.07]" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sea/30 blur-[120px]" />

      <div className="shell relative">
        <Reveal>
          <SectionLabel tone="light">The route</SectionLabel>
        </Reveal>
        <div className="mt-4 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <Reveal>
            <h2 className="display text-4xl text-shell sm:text-5xl" data-testid="text-process-heading">
              How we work at SHIPLI
            </h2>
            <p className="mt-6 max-w-sm text-base leading-8 text-mist/80">
              Six steps, each one owned by a SHIPLI team. You only ever worry about two things: receiving your product,
              and your money.
            </p>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.07}>
                <div
                  className="group relative h-full rounded-2xl border border-white/[0.12] bg-white/[0.06] p-6 backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:border-sky/50 hover:bg-white/[0.1]"
                  data-testid={`card-process-${index + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-sky">{String(index + 1).padStart(2, '0')}</span>
                    <Icon name={step.icon} size={19} className="text-coral" />
                  </div>
                  <h3 className="mt-10 text-base font-bold leading-tight tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-mist/75">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
