import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT } from '@/data/content';
import { PageHeader, Reveal, SectionLabel } from '@/components/ui';

const CHANNELS = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    note: 'Quotations and specifications',
  },
  {
    icon: Phone,
    label: 'Morocco desk',
    value: CONTACT.moroccoPhone,
    href: `tel:${CONTACT.moroccoPhone.replace(/[^+\d]/g, '')}`,
    note: 'Contracts, customs and delivery',
  },
  {
    icon: Phone,
    label: 'China desk',
    value: CONTACT.chinaPhone,
    href: `tel:${CONTACT.chinaPhone.replace(/[^+\d]/g, '')}`,
    note: 'Factories, samples and inspection',
  },
  {
    icon: MapPin,
    label: 'Offices',
    value: CONTACT.cities,
    note: 'Both ends of the corridor, staffed',
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the people who will actually move your goods"
        intro="No call centre, no intermediary. You reach the Morocco desk that signs your contract or the China desk that walks the factory floor."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell grid gap-14 lg:grid-cols-[.9fr_1fr]">
          <Reveal>
            <SectionLabel>Direct lines</SectionLabel>
            <h2 className="display mt-4 text-3xl text-abyss sm:text-4xl">Reach us where it is fastest</h2>
            <div className="mt-10 space-y-3">
              {CHANNELS.map((channel) => {
                const inner = (
                  <div className="flex items-start gap-4 rounded-2xl border border-sea/10 bg-shell p-5 transition duration-300 group-hover:border-sea/30 group-hover:bg-foam">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sea">
                      <channel.icon size={18} />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-deep/50">{channel.label}</p>
                      <p className="mt-1.5 text-base font-bold text-abyss">{channel.value}</p>
                      <p className="mt-1 text-sm text-deep/65">{channel.note}</p>
                    </div>
                  </div>
                );
                return channel.href ? (
                  <a key={channel.label} href={channel.href} className="group block">
                    {inner}
                  </a>
                ) : (
                  <div key={channel.label} className="group">
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-abyss p-5 text-shell">
              <Clock size={18} className="mt-0.5 shrink-0 text-sky" />
              <p className="text-sm leading-6 text-mist/85">{CONTACT.hours}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-sea/[0.12] bg-shell p-7 sm:p-9">
              <SectionLabel>Send a message</SectionLabel>
              <h2 className="display mt-4 text-2xl text-abyss sm:text-3xl">Tell us what you need</h2>
              <p className="mt-3 text-sm leading-6 text-deep/70">
                For a full sourcing brief with specs, quantities and budget, use the{' '}
                <Link to="/start" className="font-bold text-sea underline underline-offset-4">
                  sourcing request form
                </Link>{' '}
                instead — it asks everything we need to quote.
              </p>

              {sent ? (
                <div className="mt-8 rounded-2xl border border-kelp/30 bg-kelp/10 p-6">
                  <p className="text-base font-bold text-abyss">Message noted.</p>
                  <p className="mt-2 text-sm leading-6 text-deep/75">
                    This site is not wired to a mailbox yet. In the meantime, email us at{' '}
                    <a href={`mailto:${CONTACT.email}`} className="font-bold text-sea">
                      {CONTACT.email}
                    </a>{' '}
                    and we will answer the same working day.
                  </p>
                </div>
              ) : (
                <form
                  className="mt-8 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" name="name" required />
                    <Field label="Company" name="company" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email" name="email" type="email" required />
                    <Field label="Phone / WhatsApp" name="phone" />
                  </div>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-deep/55">Message</span>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      className="mt-2 w-full rounded-2xl border border-sea/15 bg-white px-4 py-3 text-sm text-abyss outline-none transition placeholder:text-deep/35 focus:border-sea focus:ring-4 focus:ring-sea/10"
                      placeholder="What product, what quantity, what timeline?"
                    />
                  </label>
                  <button type="submit" className="btn-primary w-full justify-center">
                    Send message
                    <ArrowUpRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-deep/55">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-2 w-full rounded-2xl border border-sea/15 bg-white px-4 py-3 text-sm text-abyss outline-none transition placeholder:text-deep/35 focus:border-sea focus:ring-4 focus:ring-sea/10"
      />
    </label>
  );
}
