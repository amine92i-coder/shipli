import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GALLERY } from '@/data/content';
import { PageHeader, Reveal } from '@/components/ui';
import { Cta } from '@/components/sections/Cta';

export default function Gallery() {
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
      <PageHeader
        eyebrow="Resources · Gallery"
        title="Factories, containers and the goods we moved"
        intro="A look at the work between the factory gate in China and the delivery door in Morocco."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((item, index) => (
              <Reveal key={item.src} delay={(index % 3) * 0.06} className={index % 5 === 0 ? 'lg:col-span-2' : ''}>
                <button
                  type="button"
                  onClick={() => setOpen(index)}
                  className={`group relative block h-full w-full overflow-hidden rounded-3xl border border-abyss/10 text-left ${
                    index % 5 === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/85 to-transparent p-5 text-sm font-semibold text-shell opacity-0 transition duration-500 group-hover:opacity-100">
                    {item.caption}
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
              aria-label="Close"
              className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-shell transition hover:bg-white/20"
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
                alt={GALLERY[open].caption}
                className="max-h-[78svh] w-full rounded-3xl object-contain"
              />
              <figcaption className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70">
                {GALLERY[open].caption}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      <Cta />
    </>
  );
}
