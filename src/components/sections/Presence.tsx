import { MapPin } from 'lucide-react';
import { CONTACT } from '@/data/content';
import { Reveal, SectionLabel } from '../ui';

const OFFICES = [
  {
    city: 'Morocco',
    role: 'Clearance · delivery · care',
    detail: 'Your brief, your contract, customs and the last mile to your door.',
    phone: CONTACT.moroccoPhone,
    dark: false,
  },
  {
    city: 'China',
    role: 'Factories · contracts · quality',
    detail: 'Factory floors, negotiation in Mandarin, inspection before departure.',
    phone: CONTACT.chinaPhone,
    dark: true,
  },
];

export function Presence() {
  return (
    <section className="border-b border-sea/10 bg-white py-24 sm:py-28" data-testid="section-presence">
      <div className="shell grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <Reveal>
          <SectionLabel>On the ground</SectionLabel>
          <h2 className="display mt-4 max-w-md text-4xl text-abyss sm:text-5xl" data-testid="text-presence-heading">
            We are present physically in Morocco and China.
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-deep/75">
            Our Morocco team manages your brief, contract, clearance and delivery. Our China team works directly with
            factories, under Chinese law, where the decisions are made.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {OFFICES.map((office, index) => (
            <Reveal key={office.city} delay={index * 0.1}>
              <div
                className={`group relative min-h-[280px] overflow-hidden rounded-3xl p-7 transition duration-500 hover:-translate-y-1 ${
                  office.dark ? 'bg-abyss text-shell' : 'bg-foam text-abyss'
                }`}
              >
                <div
                  className={`absolute right-5 top-5 h-32 w-32 rounded-full border ${
                    office.dark ? 'border-white/20' : 'border-sea/25'
                  }`}
                />
                <div
                  className={`absolute right-14 top-14 h-14 w-14 rounded-full border ${
                    office.dark ? 'border-white/20' : 'border-sea/25'
                  }`}
                />
                <MapPin className="relative text-coral" size={24} />
                <p
                  className={`relative mt-24 font-mono text-[10px] uppercase tracking-[0.18em] ${
                    office.dark ? 'text-sky' : 'text-sea'
                  }`}
                >
                  Office / {office.city}
                </p>
                <h3 className="display relative mt-2 text-3xl">{office.city}</h3>
                <p className={`relative mt-1 text-sm ${office.dark ? 'text-mist/75' : 'text-deep/70'}`}>{office.role}</p>
                <p className={`relative mt-4 text-xs leading-6 ${office.dark ? 'text-mist/60' : 'text-deep/60'}`}>
                  {office.detail}
                </p>
                <a
                  href={`tel:${office.phone.replace(/[^\d+]/g, '')}`}
                  className={`relative mt-4 inline-block font-mono text-[11px] tracking-[0.1em] transition ${
                    office.dark ? 'text-sky hover:text-white' : 'text-sea hover:text-abyss'
                  }`}
                >
                  {office.phone}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
