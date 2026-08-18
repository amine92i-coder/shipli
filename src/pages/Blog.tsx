import { ArrowUpRight } from 'lucide-react';
import { BLOG_POSTS } from '@/data/content';
import { PageHeader, Reveal } from '@/components/ui';
import { Cta } from '@/components/sections/Cta';
import { useT } from '@/i18n/LangContext';
import { numericLocale } from '@/i18n';

export default function Blog() {
  const t = useT();
  const [lead, ...rest] = BLOG_POSTS;
  const [leadCopy, ...restCopy] = t.blog.posts;

  /**
   * Rebuilt per render because the locale changes with the language: the same
   * date reads "12 March 2025", "12 mars 2025" and "12 مارس 2025".
   * numericLocale() keeps the Arabic digits Western — see its comment for why.
   */
  const date = new Intl.DateTimeFormat(numericLocale(t.meta.locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <PageHeader eyebrow={t.blog.eyebrow} title={t.blog.title} intro={t.blog.intro} />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <article className="group grid gap-8 overflow-hidden rounded-[2rem] border border-sea/[0.12] bg-shell p-7 sm:p-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
              <div>
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-deep/55">
                  <span className="rounded-full bg-coral/[0.12] px-3 py-1 text-coral">{leadCopy.tag}</span>
                  <span>{date.format(new Date(lead.date))}</span>
                  <span>·</span>
                  <span>{leadCopy.read}</span>
                </div>
                <h2 className="display mt-6 max-w-xl text-3xl text-abyss sm:text-4xl">{leadCopy.title}</h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-deep/75">{leadCopy.excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-sea transition group-hover:gap-3">
                  {t.blog.read}
                  <ArrowUpRight size={15} className="rtl:rotate-[-90deg]" />
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
                    <span className="rounded-full bg-foam px-3 py-1 text-sea">{restCopy[index].tag}</span>
                    <span>{restCopy[index].read}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold leading-7 tracking-tight text-abyss">
                    {restCopy[index].title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-deep/70">{restCopy[index].excerpt}</p>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-deep/45">
                    {date.format(new Date(post.date))}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <p className="mt-10 text-sm text-deep/60">{t.blog.more}</p>
          </Reveal>
        </div>
      </section>

      <Cta />
    </>
  );
}
