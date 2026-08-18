import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { Reveal, SectionLabel } from '../ui';

/**
 * Drop a file into /public/videos and set VIDEO_SRC to swap the placeholder for the real film.
 */
const VIDEO_SRC = '';

export function VideoBlock() {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="film" className="relative overflow-hidden bg-abyss py-24 text-shell sm:py-32" data-testid="section-video">
      <div className="grid-lines absolute inset-0 opacity-[0.08]" />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-sea/25 blur-[120px]" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky/15 blur-[100px]" />

      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_.85fr] lg:items-center">
          <Reveal>
            <div className="group relative aspect-video overflow-hidden rounded-[1.75rem] border border-white/15 bg-deep/60 shadow-[0_40px_100px_-40px_rgba(0,0,0,.9)]">
              {playing && VIDEO_SRC ? (
                <video src={VIDEO_SRC} controls autoPlay className="h-full w-full object-cover" />
              ) : (
                <>
                  {/* Real poster frame from a supplier visit — the film is not
                      shot yet, but the still should still be ours. */}
                  <img
                    src="/images/gallery/gallery-6.jpg"
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full scale-105 object-cover transition duration-[1200ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-abyss/45" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(94,194,232,.28),transparent_60%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/85 via-transparent to-abyss/45" />
                  <div className="dot-grid absolute inset-0 opacity-20" />

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 font-mono text-[10px] uppercase tracking-[0.18em] text-sky">
                    <span>SHIPLI / field note 01</span>
                    <span className="rounded-full border border-white/20 px-3 py-1">Coming soon</span>
                  </div>

                  <button
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-coral text-abyss transition duration-300 hover:scale-105"
                    aria-label="Play the SHIPLI film"
                    data-testid="button-play-video"
                  >
                    <span className="absolute inset-0 animate-pulseRing rounded-full border-2 border-coral/60" />
                    <Play size={28} fill="currentColor" className="ml-1" />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 py-5">
                    <div>
                      <span className="block h-px w-14 bg-coral" />
                      <p className="display mt-3 text-2xl text-shell">
                        From brief
                        <br />
                        to warehouse.
                      </p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky">Morocco ↔ China</span>
                  </div>

                  {playing && !VIDEO_SRC && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-abyss/[0.92] px-8 text-center"
                    >
                      <p className="max-w-xs text-sm leading-6 text-mist">
                        The SHIPLI film is not shot yet. This frame is reserved for it — drop the file in and it plays
                        here.
                      </p>
                      <button
                        onClick={() => setPlaying(false)}
                        className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sky transition hover:bg-white/10"
                        data-testid="button-close-video"
                      >
                        <X size={13} /> Close
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <SectionLabel tone="light">A different kind of middle</SectionLabel>
            <h2
              className="display mt-4 text-4xl leading-[1.12] text-shell sm:text-5xl"
              data-testid="text-video-heading"
            >
              Sourcing With Full Control.
              <span className="mt-2 block text-sky">Own the Market With Your Price.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-mist/80">
              One company, two offices, no invisible handoffs. SHIPLI takes your brief from a direct factory
              relationship in China to a cleared, delivered order in Morocco — with the contracts, checks and decisions
              in between kept visible.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm font-bold text-shell">
              <span className="h-2 w-2 rounded-full bg-coral" />
              No agents at any step.
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
