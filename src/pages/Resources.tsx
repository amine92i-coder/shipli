import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { BLOG_POSTS, FAQS, GALLERY } from '@/data/content';
import { PageHeader, Reveal, SectionLabel } from '@/components/ui';
import { Cta } from '@/components/sections/Cta';

const CARDS = [
  {
    to: '/blog',
    label: 'Blog',
    title: 'Field notes on importing from China',
    body: 'Landed cost, route selection, supplier risk and private label — written for Moroccan businesses.',
    image: '/images/gallery/gallery-2.jpg',
    meta: `${BLOG_POSTS.length} articles`,
  },
  {
    to: '/gallery',
    label: 'Gallery',
    title: 'Factories, containers and projects',
    body: 'What the work actually looks like between the factory gate in China and your door in Morocco.',
    image: '/images/gallery/gallery-5.jpg',
    meta: `${GALLERY.length} photographs`,
  },
  {
    to: '/faq',
    label: 'FAQ',
    title: 'Duties, timelines and protection',
    body: 'Customs rates, sea versus air timing, minimum orders and how your payment is secured.',
    image: '/images/gallery/gallery-7.jpg',
    meta: `${FAQS.length} answers`,
  },
];

export default function Resources() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Everything we know, made available before you commit"
        intro="Read the notes, look at the work, and check the answers. Then start a sourcing request with a clear picture of what importing actually involves."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          <div className="grid gap-4 md:grid-cols-3">
            {CARDS.map((card, index) => (
              <Reveal key={card.to} delay={index * 0.08}>
                <Link
                  to={card.to}
                  className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-sea/[0.12] bg-shell transition duration-500 hover:-translate-y-1.5 hover:border-sea/30"
                >
                  <div className="overflow-hidden">
                    <img
                      src={card.image}
                      alt=""
                      className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-deep/50">
                      <span className="text-sea">{card.label}</span>
                      <span>{card.meta}</span>
                    </div>
                    <h2 className="mt-5 text-xl font-bold leading-7 tracking-tight text-abyss">{card.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-7 text-deep/70">{card.body}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sea transition group-hover:gap-3">
                      Open
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-6 grid gap-8 rounded-[2rem] bg-abyss p-8 text-shell sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <SectionLabel tone="light">Ask directly</SectionLabel>
                <h2 className="display mt-4 max-w-xl text-3xl text-shell sm:text-4xl">
                  Cannot find the answer you need?
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-mist/75">
                  Send us the product and the quantity. We will come back with a landed cost, a route and a timeline
                  rather than a brochure.
                </p>
              </div>
              <Link to="/start" className="btn-primary shrink-0">
                Start a sourcing request
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Cta />
    </>
  );
}
