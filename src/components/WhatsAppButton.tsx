import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { WHATSAPP } from '@/data/content';

export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.message)}`;

/** lucide ships no WhatsApp mark, so the glyph lives here. */
export function WhatsAppIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.77-1.66-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.07-.13-.27-.2-.56-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.91-9.91a9.85 9.85 0 0 0-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.83c2.16 0 4.19.84 5.72 2.37a8.03 8.03 0 0 1 2.36 5.71c0 4.46-3.63 8.08-8.09 8.08a8.06 8.06 0 0 1-4.11-1.13l-.3-.17-3.12.82.83-3.04-.19-.31a8.03 8.03 0 0 1-1.23-4.29c0-4.45 3.63-8.08 8.09-8.08z" />
    </svg>
  );
}

/**
 * Floating chat launcher. Sits above the footer on every page, hides itself
 * while the sourcing form is open so it never covers a field, and pops a
 * one-line invitation the first time a visitor pauses.
 */
const TEASE_KEY = 'shipli:wa-teased';

export function WhatsAppButton() {
  const [teasing, setTeasing] = useState(false);
  // Once per session — a bubble that reappears on every page view is a nag.
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(TEASE_KEY) === '1';
    } catch {
      return false;
    }
  });

  /**
   * The bubble waits for the visitor to leave the hero before it speaks. It is
   * 308px wide and lands bottom-right, which is exactly where the hero's route
   * map puts Singapore — teasing on a timer alone covered the Malacca waypoint
   * on every first load. Once they have scrolled past the fold there is nothing
   * underneath it worth protecting.
   */
  useEffect(() => {
    if (dismissed) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const arm = () => {
      if (timer) return;
      timer = setTimeout(() => setTeasing(true), 2500);
      window.removeEventListener('scroll', onScroll);
    };
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) arm();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // already scrolled down on mount (a refresh mid-page)
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [dismissed]);

  function dismiss() {
    setTeasing(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(TEASE_KEY, '1');
    } catch {
      /* private mode — the bubble just shows again next session */
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {teasing && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="mb-1 hidden max-w-[15rem] items-start gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-16px_rgba(4,38,59,.45)] ring-1 ring-sea/10 sm:flex"
          >
            <p className="text-xs leading-5 text-deep">
              Need a price from China? Message us — we usually reply the same day.
            </p>
            <button
              onClick={dismiss}
              className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-deep/40 transition hover:bg-shell hover:text-deep"
              aria-label="Dismiss"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={dismiss}
        aria-label="Chat with SHIPLI on WhatsApp"
        data-testid="button-whatsapp-float"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-8px_rgba(37,211,102,.7)] transition duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      >
        <span className="absolute inset-0 animate-pulseRing rounded-full border-2 border-[#25D366]/60" />
        <WhatsAppIcon size={29} />
      </a>
    </div>
  );
}
