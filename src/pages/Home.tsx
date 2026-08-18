import { Hero } from '@/components/Hero';
import { Partners } from '@/components/sections/Partners';
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
      <Hero />
      <Partners />
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
