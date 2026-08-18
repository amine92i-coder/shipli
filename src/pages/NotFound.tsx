import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useT } from '@/i18n/LangContext';

export default function NotFound() {
  const t = useT();
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-abyss text-shell">
      <div className="dot-grid absolute inset-0 opacity-20" />
      <div className="absolute -start-24 top-1/3 h-96 w-96 rounded-full bg-sea/30 blur-3xl" />
      <div className="shell relative">
        <p className="eyebrow text-sky">{t.notFound.error}</p>
        <h1 className="display mt-5 max-w-2xl text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95]">{t.notFound.title}</h1>
        <p className="mt-6 max-w-lg text-base leading-8 text-mist/75">{t.notFound.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="btn-primary">
            {t.notFound.home}
            <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
          </Link>
          <Link to="/start" className="btn-ghost border-white/25 bg-white/5 text-shell hover:bg-white/15">
            {t.notFound.start}
          </Link>
        </div>
      </div>
    </section>
  );
}
