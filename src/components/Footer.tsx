import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT, NAV } from '@/data/content';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-abyss text-shell" data-testid="site-footer">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/50 to-transparent" />
      <div className="dot-grid absolute inset-0 opacity-[0.07]" />

      <div className="shell relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-sm leading-7 text-mist/80">
              One company across two countries. We buy at the factory gate in China, ship as an authorised carrier
              partner, clear Moroccan customs ourselves and deliver to your door.
            </p>
            <Link to="/start" className="mt-7 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-bold text-abyss transition hover:-translate-y-0.5">
              Start sourcing
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {NAV.filter((item) => item.children).map((item) => (
              <div key={item.label}>
                <p className="eyebrow text-sky">{item.label}</p>
                <ul className="mt-4 space-y-2.5">
                  {item.children!.map((child) => (
                    <li key={child.to}>
                      <Link to={child.to} className="text-sm text-mist/80 transition hover:text-white">
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="eyebrow text-sky">Contact</p>
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
                    <a href={`tel:${CONTACT.moroccoPhone.replace(/[^\d+]/g, '')}`} className="block transition hover:text-white">
                      {CONTACT.moroccoPhone}
                    </a>
                    <span className="font-mono text-[10px] tracking-[0.12em] text-mist/50">MOROCCO</span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone size={15} className="mt-0.5 shrink-0 text-sky" />
                  <span>
                    <a href={`tel:${CONTACT.chinaPhone.replace(/[^\d+]/g, '')}`} className="block transition hover:text-white">
                      {CONTACT.chinaPhone}
                    </a>
                    <span className="font-mono text-[10px] tracking-[0.12em] text-mist/50">CHINA</span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-sky" />
                  {CONTACT.cities}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-mist/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} SHIPLI — All rights reserved</span>
          <span>{CONTACT.hours}</span>
        </div>
      </div>
    </footer>
  );
}
