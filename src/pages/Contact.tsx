import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { PageHeader, Reveal, SectionLabel } from '@/components/ui';

export default function Contact() {
  const t = useT();
  const [sent, setSent] = useState(false);

  /**
   * Built inside the component, and keyed rather than positional: unlike the rest
   * of the site these five entries mix translated prose (label, note) with data
   * that must never be translated (the address, the dialable number). Naming the
   * keys means a reordering in either place cannot silently pair the China note
   * with the Morocco number.
   *
   * The values that stay put are the ones a courier or a phone dialler consumes:
   * an address has to read the way the local post office expects it, and a number
   * has to survive being tapped.
   */
  const c = t.contact.channels;
  const CHANNELS = [
    { icon: Mail, label: c.email.label, value: CONTACT.email, href: `mailto:${CONTACT.email}`, note: c.email.note, ltr: true },
    {
      icon: Phone,
      label: c.morocco.label,
      value: CONTACT.moroccoPhone,
      href: `tel:${CONTACT.moroccoPhone.replace(/[^+\d]/g, '')}`,
      note: c.morocco.note,
      ltr: true,
    },
    {
      icon: Phone,
      label: c.china.label,
      value: CONTACT.chinaPhone,
      href: `tel:${CONTACT.chinaPhone.replace(/[^+\d]/g, '')}`,
      note: c.china.note,
      ltr: true,
    },
    { icon: MapPin, label: c.moroccoOffice.label, value: c.moroccoOffice.value, note: CONTACT.moroccoAddress, ltr: true },
    { icon: MapPin, label: c.chinaOffice.label, value: c.chinaOffice.value, note: CONTACT.chinaAddress, ltr: true },
  ];

  return (
    <>
      <PageHeader eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro} />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell grid gap-14 lg:grid-cols-[.9fr_1fr]">
          <Reveal>
            <SectionLabel>{t.contact.linesLabel}</SectionLabel>
            <h2 className="display mt-4 text-3xl text-abyss sm:text-4xl">{t.contact.linesTitle}</h2>
            <div className="mt-10 space-y-3">
              {CHANNELS.map((channel) => {
                const inner = (
                  <div className="flex items-start gap-4 rounded-2xl border border-sea/10 bg-shell p-5 transition duration-300 group-hover:border-sea/30 group-hover:bg-foam">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sea">
                      <channel.icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-deep/50">{channel.label}</p>
                      {/* dir="ltr" keeps "+212 6…" from being reordered into an
                          undialable string; rtl:text-right keeps it flush with the
                          Arabic label above it. */}
                      <p className="mt-1.5 text-base font-bold text-abyss" dir={channel.ltr ? 'ltr' : undefined}>
                        {channel.value}
                      </p>
                      <p
                        className="mt-1 text-sm text-deep/65 rtl:text-right"
                        dir={channel.ltr ? 'ltr' : undefined}
                      >
                        {channel.note}
                      </p>
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
              <p className="text-sm leading-6 text-mist/85">{t.footer.hours}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-sea/[0.12] bg-shell p-7 sm:p-9">
              <SectionLabel>{t.contact.formLabel}</SectionLabel>
              <h2 className="display mt-4 text-2xl text-abyss sm:text-3xl">{t.contact.formTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-deep/70">
                {t.contact.formIntroA}{' '}
                <Link to="/start" className="font-bold text-sea underline underline-offset-4">
                  {t.contact.formIntroLink}
                </Link>{' '}
                {t.contact.formIntroB}
              </p>

              {sent ? (
                <div className="mt-8 rounded-2xl border border-kelp/30 bg-kelp/10 p-6">
                  <p className="text-base font-bold text-abyss">{t.contact.sentTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-deep/75">
                    {t.contact.sentBodyA}{' '}
                    <a href={`mailto:${CONTACT.email}`} className="font-bold text-sea" dir="ltr">
                      {CONTACT.email}
                    </a>{' '}
                    {t.contact.sentBodyB}
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
                    <Field label={t.contact.fieldName} name="name" required />
                    <Field label={t.contact.fieldCompany} name="company" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={t.contact.fieldEmail} name="email" type="email" required />
                    <Field label={t.contact.fieldPhone} name="phone" />
                  </div>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-deep/55">
                      {t.contact.fieldMessage}
                    </span>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      className="mt-2 w-full rounded-2xl border border-sea/15 bg-white px-4 py-3 text-sm text-abyss outline-none transition placeholder:text-deep/35 focus:border-sea focus:ring-4 focus:ring-sea/10"
                      placeholder={t.contact.messagePlaceholder}
                    />
                  </label>
                  <button type="submit" className="btn-primary w-full justify-center">
                    {t.contact.send}
                    <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
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
