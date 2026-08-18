import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { GALLERY } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { Reveal, SectionLabel } from '../ui';

export function GalleryStrip() {
  const t = useT();
  return (
    <section className="bg-white py-24 sm:py-28" data-testid="section-gallery">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>{t.galleryStrip.label}</SectionLabel>
              <h2 className="display mt-4 text-4xl text-abyss sm:text-5xl">{t.galleryStrip.title}</h2>
            </div>
            <Link to="/gallery" className="btn-ghost shrink-0">
              {t.galleryStrip.cta}
              <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {GALLERY.slice(0, 8).map((item, index) => (
            <Reveal key={item.src} delay={index * 0.05}>
              {/* Uniform 4:5 — the source photos are overwhelmingly portrait,
                  so one tall aspect keeps the row on a clean grid. */}
              <figure className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-foam">
                <img
                  src={item.src}
                  alt={t.gallery.captions[index]}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/75 via-abyss/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-xs font-semibold leading-5 text-shell opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {t.gallery.captions[index]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
