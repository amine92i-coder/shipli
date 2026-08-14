import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Boxes,
  Building2,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Package,
  Scale,
  Ship,
  Truck,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  factory: Factory,
  boxes: Boxes,
  ship: Ship,
  clipboard: ClipboardCheck,
  truck: Truck,
  file: FileCheck2,
  scale: Scale,
  badge: BadgeCheck,
  package: Package,
  building: Building2,
};

export function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  const Cmp = ICONS[name] ?? Boxes;
  return <Cmp size={size} className={className} />;
}

export function SectionLabel({ children, tone = 'sea' }: { children: ReactNode; tone?: 'sea' | 'light' }) {
  return <p className={`eyebrow ${tone === 'light' ? 'text-sky' : 'text-sea'}`}>{children}</p>;
}

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-sea/10 bg-[linear-gradient(180deg,#E4F3FA_0%,#F5FAFD_100%)] pb-16 pt-36 sm:pb-24 sm:pt-44">
      <div className="dot-grid absolute inset-0 opacity-40" />
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-sky/25 blur-3xl" />
      <div className="shell relative">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-coral" />
            <SectionLabel>{eyebrow}</SectionLabel>
          </div>
          <h1 className="display mt-5 max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] text-abyss">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-base leading-8 text-deep/80 sm:text-lg">{intro}</p>}
        </Reveal>
      </div>
    </header>
  );
}
