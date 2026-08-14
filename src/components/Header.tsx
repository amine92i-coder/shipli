import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { NAV } from '@/data/content';
import { Logo } from './Logo';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Only the homepage hero is light enough to sit under a transparent bar.
  const solid = scrolled || pathname !== '/';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
        solid ? 'border-b border-sea/10 bg-shell/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
      data-testid="site-header"
    >
      <div className="shell flex h-[74px] items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(item.children ? item.label : null)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                to={item.to}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
                  pathname === item.to ? 'text-abyss' : 'text-deep/75 hover:text-abyss'
                }`}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
                {item.children && (
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${openMenu === item.label ? 'rotate-180' : ''}`}
                  />
                )}
              </Link>

              <AnimatePresence>
                {item.children && openMenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full w-[340px] -translate-x-1/2 pt-3"
                  >
                    <div className="overflow-hidden rounded-2xl border border-sea/[0.12] bg-white/95 p-2 shadow-[0_24px_60px_-24px_rgba(4,38,59,.45)] backdrop-blur-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="group block rounded-xl px-3.5 py-3 transition hover:bg-foam"
                        >
                          <span className="flex items-center justify-between gap-3 text-sm font-bold text-abyss">
                            {child.label}
                            <ArrowUpRight
                              size={14}
                              className="shrink-0 text-sea opacity-0 transition group-hover:opacity-100"
                            />
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-deep/65">{child.blurb}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/start"
            className="flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-[12px] font-bold text-abyss transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(242,118,92,.9)]"
            data-testid="button-header-start"
          >
            Start sourcing
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-full border border-sea/20 bg-white/70 p-2.5 backdrop-blur lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="h-[calc(100svh-74px)] overflow-y-auto border-t border-sea/10 bg-shell px-5 pb-10 pt-4 lg:hidden"
            data-testid="mobile-menu"
          >
            {NAV.map((item) => (
              <div key={item.label} className="border-b border-sea/10">
                <div className="flex items-center justify-between">
                  <Link to={item.to} className="flex-1 py-4 text-base font-bold text-abyss">
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      onClick={() => setMobileGroup(mobileGroup === item.label ? null : item.label)}
                      className="p-3 text-sea"
                      aria-label={`Toggle ${item.label}`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${mobileGroup === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>
                {item.children && mobileGroup === item.label && (
                  <div className="pb-3 pl-3">
                    {item.children.map((child) => (
                      <Link key={child.to} to={child.to} className="block py-2.5 text-sm font-semibold text-deep/80">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/start"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-bold text-abyss transition duration-300 active:translate-y-px"
            >
              Start sourcing
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
