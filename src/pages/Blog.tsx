import { ArrowUpRight } from 'lucide-react';
import { BLOG_POSTS } from '@/data/content';
import { PageHeader, Reveal } from '@/components/ui';
import { Cta } from '@/components/sections/Cta';

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Blog() {
  const [lead, ...rest] = BLOG_POSTS;

  return (
    <>
      <PageHeader
        eyebrow="Resources · Blog"
        title="Field notes from the Morocco–China corridor"
        intro="What we learn on factory floors, at the port and in the customs queue — written for Moroccan businesses that import."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <article className="group grid gap-8 overflow-hidden rounded-[2rem] border border-sea/[0.12] bg-shell p-7 sm:p-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
              <div>
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-deep/55">
                  <span className="rounded-full bg-coral/[0.12] px-3 py-1 text-coral">{lead.tag}</span>
                  <span>{DATE.format(new Date(lead.date))}</span>
                  <span>·</span>
                  <span>{lead.read}</span>
                </div>
                <h2 className="display mt-6 max-w-xl text-3xl text-abyss sm:text-4xl">{lead.title}</h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-deep/75">{lead.excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-sea transition group-hover:gap-3">
                  Read the note
                  <ArrowUpRight size={15} />
                </span>
              </div>
              <div className="overflow-hidden rounded-3xl border border-abyss/10">
                <img
                  src="/images/gallery/gallery-1.jpg"
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
            </article>
          </Reveal>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {rest.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.07}>
                <article className="card group flex h-full flex-col p-7 hover:-translate-y-1.5 hover:border-sea/30">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-deep/55">
                    <span className="rounded-full bg-foam px-3 py-1 text-sea">{post.tag}</span>
                    <span>{post.read}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold leading-7 tracking-tight text-abyss">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-deep/70">{post.excerpt}</p>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-deep/45">
                    {DATE.format(new Date(post.date))}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <p className="mt-10 text-sm text-deep/60">
              More notes are being written. If there is a question you want answered here, tell us and we will publish
              it.
            </p>
          </Reveal>
        </div>
      </section>

      <Cta />
    </>
  );
}
