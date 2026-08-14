import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '@/data/content';
import { Reveal, SectionLabel } from '../ui';

export function Faq({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(0);
  const items = limit ? FAQS.slice(0, limit) : FAQS;

  return (
    <section id="faq" className="bg-shell py-24 sm:py-32" data-testid="section-faq">
      <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8">
        <Reveal className="text-center">
          <SectionLabel>The short answers</SectionLabel>
          <h2 className="display mt-4 text-4xl text-abyss sm:text-5xl" data-testid="text-faq-heading">
            Questions, answered plainly.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-deep/70">
            No jargon, no disappearing acts. If your question is not here, ask us directly.
          </p>
        </Reveal>

        <div className="mt-12 border-t border-sea/15">
          {items.map((item, index) => (
            <div key={item.q} className="border-b border-sea/15" data-testid={`faq-item-${index + 1}`}>
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
                aria-expanded={open === index}
                data-testid={`button-faq-${index + 1}`}
              >
                <span className="text-base font-bold tracking-tight text-abyss sm:text-lg">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-sea transition-transform duration-300 ${open === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.7, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-deep/75">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
