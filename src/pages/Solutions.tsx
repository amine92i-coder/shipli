import { Link } from 'react-router-dom';
import { ArrowUpRight, Calculator, Check } from 'lucide-react';
import { SERVICES } from '@/data/content';
import { Icon, PageHeader, Reveal, SectionLabel } from '@/components/ui';
import { Process } from '@/components/sections/Process';
import { Faq } from '@/components/sections/Faq';
import { Cta } from '@/components/sections/Cta';

const BRAND_STEPS = [
  'Private labelling with your logo on the product',
  'Custom packaging, inserts and retail-ready cartons',
  'Colour, material and finish changes at the factory',
  'Barcode, compliance and market-specific labelling',
  'Sample round before the production run is released',
];

export default function Solutions() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Two ways to buy from China, both fully controlled"
        intro="Straight sourcing when you know what you want, or sourcing under your own brand when the product needs to carry your name. Either way, SHIPLI stays the only company in the chain."
      />

      <section id="sourcing" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>Solution 01</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">Sourcing</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-deep/75">
              We find the factory, negotiate at the local price, sign on both ends, inspect before departure, ship as an
              authorised carrier partner, clear Moroccan customs ourselves, and deliver to your door.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.06}>
                <div className="card group h-full p-7 hover:-translate-y-1.5 hover:border-sea/30">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foam text-sea transition duration-300 group-hover:bg-sea group-hover:text-white">
                    <Icon name={service.icon} size={19} />
                  </span>
                  <h3 className="mt-6 text-lg font-bold tracking-tight text-abyss">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-deep/70">{service.body}</p>
                  <Link
                    to="/start"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sea transition hover:gap-3"
                  >
                    Get a quote
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="branded" className="scroll-mt-24 overflow-hidden bg-sand py-20 sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_.85fr] lg:items-center">
          <Reveal>
            <SectionLabel>Solution 02</SectionLabel>
            <h2 className="display mt-4 max-w-xl text-4xl text-abyss sm:text-5xl">
              Sourcing with a personalised brand
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-deep/80">
              Strengthen your business identity with private labelling, custom packaging, logo printing and product
              customisation. The same factory, the same controlled chain — with your name on the box instead of
              somebody else&rsquo;s.
            </p>
            <ul className="mt-8 space-y-3">
              {BRAND_STEPS.map((step) => (
                <li key={step} className="flex items-start gap-3 text-sm leading-6 text-deep">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-sea">
                    <Check size={13} />
                  </span>
                  {step}
                </li>
              ))}
            </ul>
            <Link to="/start" className="btn-primary mt-9">
              Brief our branding desk
              <ArrowUpRight size={16} />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-abyss/10">
              <img
                src="/images/gallery/gallery-7.jpg"
                alt="A client logo being stitched onto webbing at the factory"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* A tool, not a third solution — so it gets a band rather than its own
          numbered section, sitting where the price question naturally lands. */}
      <section className="relative overflow-hidden bg-abyss py-16 text-shell sm:py-20">
        <div className="grid-lines absolute inset-0 opacity-[0.08]" />
        <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-sea/30 blur-[110px]" />
        <div className="shell relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal>
            <SectionLabel tone="light">Before you commit</SectionLabel>
            <h2 className="display mt-4 max-w-lg text-3xl text-shell sm:text-4xl">
              See the landed cost, not just the factory price
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-mist/75">
              Goods, freight, duty, VAT and our fee — itemised, in USD and dirhams, before a single carton moves.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/calculator"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-bold text-abyss transition duration-300 hover:-translate-y-0.5"
              data-testid="link-solutions-calculator"
            >
              <Calculator size={16} />
              Open the calculator
            </Link>
          </Reveal>
        </div>
      </section>

      <Process />
      <Faq limit={5} />
      <Cta />
    </>
  );
}
