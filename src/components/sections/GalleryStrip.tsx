import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { GALLERY } from '@/data/content';
import { Reveal, SectionLabel } from '../ui';

export function GalleryStrip() {
  return (
    <section className="bg-white py-24 sm:py-28" data-testid="section-gallery">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>Our projects</SectionLabel>
              <h2 className="display mt-4 text-4xl text-abyss sm:text-5xl">Explore some of our shipments</h2>
            </div>
            <Link to="/gallery" className="btn-ghost shrink-0">
              View the gallery
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {GALLERY.slice(0, 8).map((item, index) => (
            <Reveal key={item.src} delay={index * 0.05}>
              <figure
                className={`group relative overflow-hidden rounded-2xl bg-foam ${
                  index === 0 || index === 5 ? 'aspect-[4/5]' : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/60 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
