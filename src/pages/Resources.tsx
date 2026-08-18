import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { BLOG_POSTS, GALLERY } from '@/data/content';
import { PageHeader, Reveal, SectionLabel } from '@/components/ui';
import { Cta } from '@/components/sections/Cta';
import { useT } from '@/i18n/LangContext';
import { fill } from '@/i18n';

/**
 * Route, image and count only — the counts are derived rather than written down
 * so a new blog post updates the card without anyone editing three dictionaries.
 * The FAQ count reads off the active dictionary because that is the list the
 * visitor will actually land on.
 */
const CARDS = [
  { to: '/blog', image: '/images/gallery/gallery-2.jpg' },
  { to: '/gallery', image: '/images/gallery/gallery-5.jpg' },
  { to: '/faq', image: '/images/gallery/gallery-7.jpg' },
];

export default function Resources() {
  const t = useT();
  const counts = [BLOG_POSTS.length, GALLERY.length, t.faq.items.length];
  return (
    <>
      <PageHeader eyebrow={t.resources.eyebrow} title={t.resources.title} intro={t.resources.intro} />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          <div className="grid gap-4 md:grid-cols-3">
            {CARDS.map((card, index) => {
              const copy = t.resources.cards[index];
              return (
              <Reveal key={card.to} delay={index * 0.08}>
                <Link
                  to={card.to}
                  className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-sea/[0.12] bg-shell transition duration-500 hover:-translate-y-1.5 hover:border-sea/30"
                >
                  <div className="overflow-hidden">
                    <img
                      src={card.image}
                      alt=""
                      className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-deep/50">
                      <span className="text-sea">{copy.label}</span>
                      <span>{fill(copy.meta, { n: counts[index] })}</span>
                    </div>
                    <h2 className="mt-5 text-xl font-bold leading-7 tracking-tight text-abyss">{copy.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-7 text-deep/70">{copy.body}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sea transition group-hover:gap-3">
                      {t.resources.open}
                      <ArrowUpRight size={15} className="rtl:rotate-[-90deg]" />
                    </span>
                  </div>
                </Link>
              </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-6 grid gap-8 rounded-[2rem] bg-abyss p-8 text-shell sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <SectionLabel tone="light">{t.resources.askLabel}</SectionLabel>
                <h2 className="display mt-4 max-w-xl text-3xl text-shell sm:text-4xl">{t.resources.askTitle}</h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-mist/75">{t.resources.askBody}</p>
              </div>
              <Link to="/start" className="btn-primary shrink-0">
                {t.resources.askCta}
                <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Cta />
    </>
  );
}
