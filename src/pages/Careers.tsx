import { ArrowUpRight, MapPin } from 'lucide-react';
import { CONTACT, JOBS } from '@/data/content';
import { PageHeader, Reveal, SectionLabel } from '@/components/ui';

const VALUES = [
  {
    title: 'Be where the goods are',
    body: 'We staff both ends of the corridor. Decisions get made by whoever is standing closest to the shipment.',
  },
  {
    title: 'Say the hard thing early',
    body: 'A supplier that will not hold spec, a timeline that will not survive Ramadan traffic — we flag it before it costs a client.',
  },
  {
    title: 'Own it end to end',
    body: 'Nobody here hands a problem to a subcontractor. If it is in our chain, it is ours to solve.',
  },
];

export default function Careers() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Careers at SHIPLI"
        intro="We are a small team running a long chain between Guangzhou and Casablanca. If you want ownership rather than a narrow lane, this is the right size of company."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>Open roles</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">
              {JOBS.length} positions across Morocco and China
            </h2>
          </Reveal>

          <div className="mt-12 border-t border-sea/15">
            {JOBS.map((job, index) => (
              <Reveal key={job.title} delay={index * 0.05}>
                <a
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Application — ${job.title}`)}`}
                  className="group grid items-center gap-4 border-b border-sea/15 py-7 transition duration-300 hover:bg-shell md:grid-cols-[1.1fr_.9fr_auto] md:gap-8"
                >
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-abyss">{job.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-deep/70">{job.body}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-foam px-3.5 py-1.5 text-xs font-bold text-sea">
                      <MapPin size={13} />
                      {job.location}
                    </span>
                    <span className="rounded-full border border-sea/20 px-3.5 py-1.5 text-xs font-bold text-deep/70">
                      {job.type}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 justify-self-start text-sm font-bold text-sea transition group-hover:gap-3 md:justify-self-end">
                    Apply
                    <ArrowUpRight size={15} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel>How we work</SectionLabel>
            <h2 className="display mt-4 max-w-2xl text-4xl text-abyss sm:text-5xl">
              Three rules that survive every shipment
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.07}>
                <div className="h-full rounded-3xl bg-white/70 p-7 backdrop-blur-sm">
                  <span className="font-mono text-xs text-sea">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-6 text-lg font-bold tracking-tight text-abyss">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-deep/75">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-abyss py-20 text-shell sm:py-24">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <Reveal>
            <SectionLabel tone="light">Speculative applications</SectionLabel>
            <h2 className="display mt-4 max-w-xl text-3xl text-shell sm:text-4xl">
              No role that fits? Write to us anyway.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-mist/75">
              Tell us what you do and where you would sit in the chain. We read every message that arrives with a real
              proposal attached.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <a href={`mailto:${CONTACT.email}?subject=Speculative%20application`} className="btn-primary shrink-0">
              Email {CONTACT.email}
              <ArrowUpRight size={16} />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
