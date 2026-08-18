import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader, Reveal, SectionLabel } from '@/components/ui';
import { LandedCostCalculator } from '@/components/LandedCostCalculator';
import { Cta } from '@/components/sections/Cta';

/** The four line items importers most often leave out of their own maths. */
const NOTES = [
  {
    n: '01',
    title: 'Duty is charged on CIF, not on the invoice',
    body: 'Moroccan customs assess the goods value plus freight and insurance, then apply the tariff. Quoting yourself on the factory price alone understates the bill every time.',
  },
  {
    n: '02',
    title: 'VAT stacks on top of duty',
    body: 'The 20% is applied after duty, not beside it. If you are VAT-registered you recover it, so treat it as cash flow rather than cost — but you still have to fund it at the port.',
  },
  {
    n: '03',
    title: 'Clearance is flat, so small orders cost more per piece',
    body: 'Declaration, port handling and the delivery order cost roughly the same whether the container holds 200 pieces or 20 000. Split across a small order it can dwarf the goods themselves — slide the quantity and watch the per-unit number move.',
  },
  {
    n: '04',
    title: 'Light and bulky is billed by volume',
    body: 'Carriers charge whichever is greater: actual weight or volumetric. Furniture, packaging and plastics almost always land on the volumetric side, which is why we measure cartons before quoting.',
  },
  {
    n: '05',
    title: 'One fee, on the goods only',
    body: 'We do not take a percentage of your freight, and we do not take a second margin from the factory. What the supplier charges us is what you see.',
  },
];

export default function Calculator() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions · Landed cost"
        title="Know the real cost before you commit a dirham"
        intro="Move the sliders to see what a China order actually costs once it has cleared Casablanca — goods, freight, duty, VAT and our fee, with nothing folded in where you cannot see it."
      />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F5FAFD_0%,#E4F3FA_100%)] py-16 sm:py-24">
        <div className="absolute -left-32 top-40 h-[420px] w-[420px] rounded-full bg-sky/20 blur-[110px]" />
        <div className="shell relative">
          <LandedCostCalculator />
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr]">
            <Reveal>
              <SectionLabel>Reading the number</SectionLabel>
              <h2 className="display mt-4 max-w-sm text-4xl text-abyss sm:text-5xl">
                Where importers get the maths wrong
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-deep/75">
                Most quotes that look cheap are only cheap because something was left out. These are the four things we
                see missed most often.
              </p>

              <figure className="relative mt-9 hidden overflow-hidden rounded-3xl lg:block">
                <img
                  src="/images/gallery/gallery-14.jpg"
                  alt="Counting cartons inside the container before the doors are sealed"
                  loading="lazy"
                  width={1200}
                  height={1600}
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/85 to-transparent p-5 font-mono text-[10px] uppercase tracking-[0.16em] text-shell">
                  Counted before the doors close
                </figcaption>
              </figure>

              <Link to="/start" className="btn-primary mt-9">
                Get the real number
                <ArrowUpRight size={16} />
              </Link>
            </Reveal>

            <div className="border-t border-sea/15">
              {NOTES.map((note, index) => (
                <Reveal key={note.n} delay={index * 0.06}>
                  <div className="grid gap-3 border-b border-sea/15 py-7 sm:grid-cols-[52px_1fr]">
                    <span className="font-mono text-xs text-sea">{note.n}</span>
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
