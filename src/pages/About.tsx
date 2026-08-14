import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { HIGHLIGHTS, PHILOSOPHY, STRATEGY, WHY } from '@/data/content';
import { PageHeader, Reveal, SectionLabel } from '@/components/ui';
import { Presence } from '@/components/sections/Presence';
import { Cta } from '@/components/sections/Cta';

const CAPABILITIES = [
  'Supplier verification',
  'Factory audits',
  'Quality inspection',
  'Customs clearance',
  'Door-to-door delivery',
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Trusted partner for global trade between Morocco and China"
        intro="We simplify international trade by connecting businesses with verified suppliers and reliable logistics, protecting you from the common risks of sourcing overseas."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <Reveal>
            <SectionLabel>Who we are</SectionLabel>
            <h2 className="display mt-4 text-3xl text-abyss sm:text-4xl">
              From product sourcing to final delivery, our team manages every stage.
            </h2>
            <p className="mt-6 text-base leading-8 text-deep/75">
              We handle each stage with transparency and care, so you can source with confidence and build long-term
              partnerships on trust. Our mission is to make international trade simple, secure and accessible by
              providing reliable sourcing, logistics and customs solutions while protecting businesses from supplier
              fraud and unnecessary risk.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {CAPABILITIES.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-deep">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foam text-sea">
                    <Check size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn-primary mt-9">
              Contact our team
              <ArrowUpRight size={16} />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-sea/10">
              <img
                src="/images/gallery/gallery-6.jpg"
                alt="A SHIPLI buyer with a Chinese supplier at a machinery yard"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/85 to-transparent p-7 text-shell">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky">SHIPLI · Morocco & China</p>
                <p className="display mt-2 text-2xl">Two teams, one accountability.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="highlights" className="scroll-mt-24 bg-foam py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>Business highlights</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">
              What five years on the corridor adds up to
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <div className="h-full rounded-3xl bg-white p-7 transition duration-500 hover:-translate-y-1.5">
                  <p className="display text-5xl text-sea">{item.value}</p>
                  <h3 className="mt-5 text-base font-bold tracking-tight text-abyss">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-deep/70">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="strategy" className="scroll-mt-24 bg-abyss py-20 text-shell sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel tone="light">Our strategy</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-shell sm:text-5xl">
              Own the chain, and the price holds.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-mist/80">
              Most importers pay two margins they never see: the agent&rsquo;s, and the one added by every subcontractor
              in the chain. Our strategy removes both by refusing to hand any step to an outsider.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {STRATEGY.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <div className="h-full rounded-3xl border border-white/[0.12] bg-white/[0.06] p-7 backdrop-blur-sm">
                  <span className="font-mono text-xs text-sky">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-6 text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-mist/75">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="philosophy" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>Management philosophy</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">
              How we decide when your money is in transit
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {PHILOSOPHY.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <div className="border-t border-sea/20 pt-6">
                  <h3 className="text-xl font-bold tracking-tight text-abyss">{item.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-deep/70">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-shell py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>Why choose SHIPLI</SectionLabel>
            <h2 className="display mt-4 text-4xl text-abyss sm:text-5xl">Your trusted logistics partner</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="card h-full p-7 hover:-translate-y-1.5 hover:border-sea/30">
                  <h3 className="text-base font-bold tracking-tight text-abyss">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-deep/70">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Presence />
      <Cta />
    </>
  );
}
