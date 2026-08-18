import { MapPin } from 'lucide-react';
import { CONTACT } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { Reveal, SectionLabel } from '../ui';

/**
 * Addresses stay here rather than in the dictionaries. A street address is not
 * translated — it has to be printable on a waybill exactly as the post office
 * in that country expects it, which is why the Hangzhou line stays in Chinese
 * even on the English site.
 */
const OFFICES = [
  { address: CONTACT.moroccoAddress, phone: CONTACT.moroccoPhone, dark: false },
  { address: CONTACT.chinaAddress, phone: CONTACT.chinaPhone, dark: true },
];

export function Presence() {
  const t = useT();
  return (
    <section className="border-b border-sea/10 bg-white py-24 sm:py-28" data-testid="section-presence">
      <div className="shell grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <Reveal>
          <SectionLabel>{t.presence.label}</SectionLabel>
          <h2 className="display mt-4 max-w-md text-4xl text-abyss sm:text-5xl" data-testid="text-presence-heading">
            {t.presence.title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-deep/75">{t.presence.body}</p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {OFFICES.map((office, index) => {
            const copy = t.presence.offices[index];
            return (
            <Reveal key={copy.city} delay={index * 0.1}>
              <div
                className={`group relative min-h-[280px] overflow-hidden rounded-3xl p-7 transition duration-500 hover:-translate-y-1 ${
                  office.dark ? 'bg-abyss text-shell' : 'bg-foam text-abyss'
                }`}
              >
                <div
                  className={`absolute end-5 top-5 h-32 w-32 rounded-full border ${
                    office.dark ? 'border-white/20' : 'border-sea/25'
                  }`}
                />
                <div
                  className={`absolute end-14 top-14 h-14 w-14 rounded-full border ${
                    office.dark ? 'border-white/20' : 'border-sea/25'
                  }`}
                />
                <MapPin className="relative text-coral" size={24} />
                <p
                  className={`relative mt-20 font-mono text-[10px] uppercase tracking-[0.18em] ${
                    office.dark ? 'text-sky' : 'text-sea'
                  }`}
                >
                  {t.presence.officePrefix} / {copy.city}
                </p>
                <h3 className="display relative mt-2 text-3xl">{copy.city}</h3>
                <p className={`relative mt-1 text-sm ${office.dark ? 'text-mist/75' : 'text-deep/70'}`}>{copy.role}</p>
                <p className={`relative mt-4 text-xs leading-6 ${office.dark ? 'text-mist/60' : 'text-deep/60'}`}>
                  {copy.detail}
                </p>
                <address
                  dir="ltr"
                  className={`relative mt-4 border-t pt-4 text-xs not-italic leading-6 rtl:text-right ${
                    office.dark ? 'border-white/15 text-mist/70' : 'border-sea/15 text-deep/70'
                  }`}
                >
                  {office.address}
                  <a
                    href={`tel:${office.phone.replace(/[^\d+]/g, '')}`}
                    className={`mt-3 block font-mono text-[11px] tracking-[0.1em] transition ${
                      office.dark ? 'text-sky hover:text-white' : 'text-sea hover:text-abyss'
                    }`}
                  >
                    {office.phone}
                  </a>
                </address>
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
