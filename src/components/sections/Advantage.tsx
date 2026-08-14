import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ADVANTAGES } from '@/data/content';
import { Icon, Reveal, SectionLabel } from '../ui';

export function Advantage() {
  return (
    <section
      id="advantage"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#F5FAFD_0%,#E4F3FA_100%)] py-24 sm:py-32"
      data-testid="section-advantage"
    >
      <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-sky/20 blur-[110px]" />
      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr]">
          <Reveal>
            <SectionLabel>The SHIPLI advantage</SectionLabel>
            <h2 className="display mt-4 max-w-sm text-4xl text-abyss sm:text-5xl" data-testid="text-advantage-heading">
              The power of full control
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-deep/75">
              Every step where other companies hand off to an outside party, we keep in-house. That is what “full
              control” actually means at SHIPLI.
            </p>
            <Link to="/start" className="btn-primary mt-8">
              Source now
              <ArrowUpRight size={16} />
            </Link>
          </Reveal>

          <div className="border-t border-sea/15">
            {ADVANTAGES.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="group grid gap-4 border-b border-sea/15 py-6 sm:grid-cols-[44px_1fr_1.05fr] sm:items-center">
                  <span className="font-mono text-xs text-sea">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sea shadow-sm transition duration-300 group-hover:bg-coral group-hover:text-abyss">
                      <Icon name={item.icon} size={17} />
                    </span>
                    <h3 className="text-[15px] font-bold leading-snug tracking-tight text-abyss">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-6 text-deep/70">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <p className="display mt-14 max-w-3xl border-l-2 border-coral pl-6 text-2xl leading-snug text-deep sm:text-3xl">
            From the factory floor in China to your warehouse in Morocco, every link in the chain is SHIPLI.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
