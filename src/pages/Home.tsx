import { Hero } from '@/components/Hero';
import { VideoBlock } from '@/components/sections/VideoBlock';
import { Advantage } from '@/components/sections/Advantage';
import { Trust } from '@/components/sections/Trust';
import { Presence } from '@/components/sections/Presence';
import { Categories } from '@/components/sections/Categories';
import { Process } from '@/components/sections/Process';
import { GalleryStrip } from '@/components/sections/GalleryStrip';
import { Faq } from '@/components/sections/Faq';
import { Cta } from '@/components/sections/Cta';

export default function Home() {
  return (
    <>
      {/* No <Partners /> here any more — the logo marquee is now the band on
          the hero's own bottom edge, where the fold cuts through it. See
          components/hero/PartnerStrip.tsx. */}
      <Hero />
      <VideoBlock />
      <Advantage />
      <Trust />
      <Presence />
      <Categories />
      <Process />
      <GalleryStrip />
      <Faq limit={6} />
      <Cta />
    </>
  );
}
