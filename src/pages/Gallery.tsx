import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GALLERY } from '@/data/content';
import { PageHeader, Reveal } from '@/components/ui';
import { Cta } from '@/components/sections/Cta';
import { useT } from '@/i18n/LangContext';

export default function Gallery() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <PageHeader eyebrow={t.galleryPage.eyebrow} title={t.galleryPage.title} intro={t.galleryPage.intro} />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          {/* Masonry columns rather than a fixed-aspect grid: these are mostly
              phone portraits, and cropping them to 16/9 threw away the subject. */}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {GALLERY.map((item, index) => (
              <Reveal key={item.src} delay={(index % 3) * 0.06} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setOpen(index)}
                  className="group relative block w-full overflow-hidden rounded-3xl border border-abyss/10 text-start"
                >
                  <img
                    src={item.src}
                    alt={t.gallery.captions[index]}
                    width={item.w}
                    height={item.h}
                    loading={index < 3 ? undefined : 'lazy'}
                    className="block h-auto w-full transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/85 to-transparent p-5 text-sm font-semibold text-shell opacity-0 transition duration-500 group-hover:opacity-100">
                    {t.gallery.captions[index]}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-abyss/[0.92] p-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={t.galleryPage.close}
              className="absolute end-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-shell transition hover:bg-white/20"
            >
              <X size={18} />
            </button>
            <motion.figure
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-full w-full max-w-4xl"
            >
              <img
                src={GALLERY[open].src}
                alt={t.gallery.captions[open]}
                className="max-h-[78svh] w-full rounded-3xl object-contain"
              />
              <figcaption className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">
                {t.gallery.captions[open]}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      <Cta />
    </>
  );
}
