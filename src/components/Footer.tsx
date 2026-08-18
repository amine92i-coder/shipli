import { Link } from 'react-router-dom';
import { ArrowUpRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT, NAV, SOCIALS } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { Logo } from './Logo';
import { WhatsAppIcon } from './WhatsAppButton';

const SOCIAL_ICONS: Record<string, (props: { size?: number }) => JSX.Element> = {
  whatsapp: (p) => <WhatsAppIcon size={p.size} />,
  instagram: (p) => <Instagram size={p.size} />,
  facebook: (p) => <Facebook size={p.size} />,
  linkedin: (p) => <Linkedin size={p.size} />,
  mail: (p) => <Mail size={p.size} />,
};

export function Footer() {
  const t = useT();
  return (
    <footer className="relative overflow-hidden bg-abyss text-shell" data-testid="site-footer">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/50 to-transparent" />
      <div className="dot-grid absolute inset-0 opacity-[0.07]" />

      <div className="shell relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-sm leading-7 text-mist/80">{t.footer.blurb}</p>
            <Link to="/start" className="mt-7 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-bold text-abyss transition hover:-translate-y-0.5">
              {t.footer.cta}
              <ArrowUpRight size={15} className="rtl:rotate-[-90deg]" />
            </Link>

            <ul className="mt-8 flex flex-wrap items-center gap-2.5" data-testid="footer-socials">
              {SOCIALS.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-mist/75 transition duration-300 hover:-translate-y-0.5 hover:border-sky/60 hover:bg-white/10 hover:text-white"
                    >
                      <Icon size={17} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {/* Zipped with the dictionary BEFORE filtering. Filtering first would
                renumber the survivors and pair "Solutions" with the copy for
                "Contact". */}
            {NAV.map((item, i) => ({ item, copy: t.nav.items[i] }))
              .filter(({ item }) => item.children)
              .map(({ item, copy }) => (
                <div key={item.label}>
                  <p className="eyebrow text-sky">{copy.label}</p>
                  <ul className="mt-4 space-y-2.5">
                    {item.children!.map((child, j) => (
                      <li key={child.to}>
                        <Link to={child.to} className="text-sm text-mist/80 transition hover:text-white">
                          {copy.children[j].label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            <div>
              <p className="eyebrow text-sky">{t.footer.contact}</p>
              <ul className="mt-4 space-y-3 text-sm text-mist/80">
                <li className="flex items-start gap-2.5">
                  <Mail size={15} className="mt-0.5 shrink-0 text-sky" />
                  <a href={`mailto:${CONTACT.email}`} className="transition hover:text-white">
                    {CONTACT.email}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone size={15} className="mt-0.5 shrink-0 text-sky" />
                  <span>
                    <a
                      href={`tel:${CONTACT.moroccoPhone.replace(/[^\d+]/g, '')}`}
                      dir="ltr"
                      className="block transition hover:text-white rtl:text-right"
                    >
                      {CONTACT.moroccoPhone}
                    </a>
                    <span className="font-mono text-[10px] tracking-[0.12em] text-mist/50">{t.footer.morocco}</span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone size={15} className="mt-0.5 shrink-0 text-sky" />
                  <span>
                    <a
                      href={`tel:${CONTACT.chinaPhone.replace(/[^\d+]/g, '')}`}
                      dir="ltr"
                      className="block transition hover:text-white rtl:text-right"
                    >
                      {CONTACT.chinaPhone}
                    </a>
                    <span className="font-mono text-[10px] tracking-[0.12em] text-mist/50">{t.footer.china}</span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-sky" />
                  <address dir="ltr" className="text-xs not-italic leading-6 rtl:text-right">
                    {CONTACT.moroccoAddress}
                    <span className="mt-1 block font-mono text-[10px] tracking-[0.12em] text-mist/50">
                      {t.footer.morocco}
                    </span>
                  </address>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-sky" />
                  <address dir="ltr" className="text-xs not-italic leading-6 rtl:text-right">
                    {CONTACT.chinaAddress}
                    <span className="mt-1 block font-mono text-[10px] tracking-[0.12em] text-mist/50">
                      {t.footer.china}
                    </span>
                  </address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-mist/55 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} SHIPLI — {t.footer.rights}
          </span>
          <span>{t.footer.hours}</span>
        </div>
      </div>
    </footer>
  );
}
