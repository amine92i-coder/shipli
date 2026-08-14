import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Boxes, Factory, PackageCheck } from 'lucide-react';
import { CATEGORIES } from '@/data/content';
import { Reveal, SectionLabel } from '../ui';

const ICONS = [Factory, Boxes, PackageCheck];
const TONES: Record<string, string> = {
  sea: 'bg-sea text-white',
  sand: 'bg-sand text-abyss',
  mist: 'bg-mist text-abyss',
};

export function Categories() {
  return (
    <section className="bg-shell py-24 sm:py-32" data-testid="section-categories">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>The range</SectionLabel>
              <h2 className="display mt-4 text-4xl text-abyss sm:text-5xl" data-testid="text-categories-heading">
                What we source
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-deep/70">
              A focused sourcing desk for the things that are hard to buy well from a distance.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => {
            const CategoryIcon = ICONS[index] ?? Boxes;
            return (
              <Reveal key={category.title} delay={index * 0.08}>
                <div
                  className={`group flex min-h-[240px] flex-col justify-between rounded-3xl p-7 transition duration-500 hover:-translate-y-1.5 ${
                    TONES[category.tone]
                  }`}
                >
                  <CategoryIcon size={26} />
                  <div>
                    <h3 className="display text-2xl leading-tight">{category.title}</h3>
                    <p className="mt-2 text-xs leading-5 opacity-75">{category.note}</p>
                    <ArrowUpRight
                      className="mt-4 opacity-60 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      size={19}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}

          <Reveal delay={0.24}>
            <div className="flex min-h-[240px] flex-col justify-between rounded-3xl border border-dashed border-sea/35 bg-white p-7">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sea">Your category</span>
                <h3 className="display mt-3 text-2xl leading-tight text-abyss">
                  Something
                  <br />
                  specific?
                </h3>
              </div>
              <Link to="/start" className="flex items-center gap-2 text-sm font-bold text-sea transition hover:gap-3">
                Ask our sourcing desk
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
