/**
 * Atmosphere for the hero corridor scene. The ship, plane, factory, containers,
 * truck and paperwork now live as vector files in /public/images/scene.
 */

export function Cloud({ className = '', variant = 0 }: { className?: string; variant?: number }) {
  const shapes = [
    'M28,52 a24,24 0 0 1 23,-30 a30,30 0 0 1 55,-4 a22,22 0 0 1 24,34 z',
    'M22,50 a20,20 0 0 1 18,-26 a26,26 0 0 1 47,-3 a19,19 0 0 1 21,29 z',
    'M30,54 a26,26 0 0 1 26,-32 a32,32 0 0 1 58,-2 a24,24 0 0 1 22,34 z',
  ];
  return (
    <svg viewBox="0 0 160 60" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`cl${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E4F3FA" />
        </linearGradient>
      </defs>
      <path d={shapes[variant % shapes.length]} fill={`url(#cl${variant})`} />
    </svg>
  );
}

export function Gull({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 24" className={className} aria-hidden="true">
      <path
        d="M4,16 Q16,2 28,14 Q40,2 56,16"
        fill="none"
        stroke="#083C5C"
        strokeOpacity=".45"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
