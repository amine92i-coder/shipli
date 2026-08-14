import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionLabel } from '../ui';

export function Cta() {
  return (
    <section
      id="start"
      className="relative overflow-hidden bg-[linear-gradient(135deg,#0E6E9E_0%,#1D96C9_55%,#5EC2E8_100%)] py-24 text-white sm:py-32"
      data-testid="section-cta"
    >
      <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full border-[34px] border-white/[0.12]" />
      <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full border-[34px] border-white/10" />

      <div className="shell relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <Reveal>
          <SectionLabel tone="light">Ready when you are.</SectionLabel>
          <h2 className="display mt-4 max-w-3xl text-5xl text-white sm:text-7xl" data-testid="text-cta-heading">
            Sourcing from China — done right.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/85">
            Bring us the brief. We will bring you the factory, the contract and the route home.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to="/start"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-bold text-abyss transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(0,0,0,.5)]"
              data-testid="button-cta-start"
            >
              Get started
              <ArrowUpRight size={17} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3.5 text-sm font-bold text-white transition duration-300 hover:bg-white/15"
            >
              Contact
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
