/**
 * Artwork for the hero ocean scene. Every part is plain SVG so the hero can animate
 * individual elements (hull, waves, smoke, cargo) rather than sliding a flat image around.
 */

export function Ship({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 210" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D5EAF6" />
        </linearGradient>
        <linearGradient id="hullLow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E6E9E" />
          <stop offset="1" stopColor="#083C5C" />
        </linearGradient>
        <linearGradient id="funnel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E6E9E" />
          <stop offset="1" stopColor="#04263B" />
        </linearGradient>
        <clipPath id="hullClip">
          <path d="M30,118 H300 L276,166 Q272,174 262,174 H62 Q50,174 45,164 Z" />
        </clipPath>
        <filter id="shipShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#04263B" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter="url(#shipShadow)">
        {/* containers */}
        <g>
          {[
            { x: 146, y: 40, w: 32, h: 24, f: '#FFFFFF' },
            { x: 180, y: 40, w: 32, h: 24, f: '#A9DEF2' },
            { x: 214, y: 40, w: 32, h: 24, f: '#FFFFFF' },
            { x: 130, y: 66, w: 32, h: 26, f: '#5EC2E8' },
            { x: 164, y: 66, w: 32, h: 26, f: '#FFFFFF' },
            { x: 198, y: 66, w: 32, h: 26, f: '#F2765C' },
            { x: 232, y: 66, w: 32, h: 26, f: '#A9DEF2' },
            { x: 122, y: 92, w: 32, h: 26, f: '#FFFFFF' },
            { x: 156, y: 92, w: 32, h: 26, f: '#A9DEF2' },
            { x: 190, y: 92, w: 32, h: 26, f: '#5EC2E8' },
            { x: 224, y: 92, w: 32, h: 26, f: '#FFFFFF' },
            { x: 258, y: 92, w: 32, h: 26, f: '#0E6E9E' },
          ].map((c, i) => (
            <g key={i}>
              <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="2.5" fill={c.f} />
              <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="2.5" fill="none" stroke="#04263B" strokeOpacity=".14" />
              <path d={`M${c.x + 4},${c.y + 4} V${c.y + c.h - 4}`} stroke="#04263B" strokeOpacity=".1" strokeWidth="1.5" />
              <path
                d={`M${c.x + c.w - 5},${c.y + 4} V${c.y + c.h - 4}`}
                stroke="#04263B"
                strokeOpacity=".1"
                strokeWidth="1.5"
              />
            </g>
          ))}
        </g>

        {/* mast */}
        <path d="M118,92 V22" stroke="#04263B" strokeWidth="3" strokeLinecap="round" />
        <path d="M118,26 h20 l-6,6 6,6 h-20 z" fill="#F2765C" />

        {/* bridge */}
        <rect x="54" y="64" width="58" height="54" rx="5" fill="url(#hull)" />
        <rect x="54" y="64" width="58" height="54" rx="5" fill="none" stroke="#04263B" strokeOpacity=".15" />
        <g fill="#0E6E9E" opacity=".55">
          <rect x="62" y="74" width="42" height="7" rx="3.5" />
          <rect x="62" y="87" width="42" height="7" rx="3.5" />
        </g>
        <rect x="68" y="38" width="20" height="28" rx="4" fill="url(#funnel)" />
        <rect x="68" y="46" width="20" height="6" fill="#5EC2E8" />

        {/* hull */}
        <path d="M30,118 H300 L276,166 Q272,174 262,174 H62 Q50,174 45,164 Z" fill="url(#hull)" />
        <g clipPath="url(#hullClip)">
          <rect x="20" y="146" width="300" height="40" fill="url(#hullLow)" />
          <rect x="20" y="140" width="300" height="5" fill="#F2765C" opacity=".85" />
        </g>
        <path
          d="M30,118 H300 L276,166 Q272,174 262,174 H62 Q50,174 45,164 Z"
          fill="none"
          stroke="#04263B"
          strokeOpacity=".18"
          strokeWidth="1.5"
        />
        <rect x="28" y="112" width="274" height="8" rx="4" fill="#FFFFFF" />
        <rect x="28" y="112" width="274" height="8" rx="4" fill="none" stroke="#04263B" strokeOpacity=".12" />
      </g>
    </svg>
  );
}

export function Port({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 260" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DCEEF8" />
        </linearGradient>
        <linearGradient id="quay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9E5F3" />
          <stop offset="1" stopColor="#8FC4DD" />
        </linearGradient>
        <filter id="portShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#04263B" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter="url(#portShadow)">
        {/* gantry cranes */}
        {[
          { x: 268, s: 1 },
          { x: 356, s: 0.86 },
        ].map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${228 - 150 * c.s}) scale(${c.s})`}>
            <path d="M6,150 V54 M62,150 V54" stroke="#0E6E9E" strokeWidth="6" strokeLinecap="round" />
            <path d="M-16,54 H96" stroke="#083C5C" strokeWidth="9" strokeLinecap="round" />
            <path d="M-16,54 L-16,74" stroke="#083C5C" strokeWidth="5" strokeLinecap="round" />
            <rect x="14" y="30" width="40" height="26" rx="5" fill="#FFFFFF" stroke="#04263B" strokeOpacity=".14" />
            <rect x="22" y="38" width="24" height="9" rx="4" fill="#5EC2E8" />
            <path d="M-16,74 h14" stroke="#F2765C" strokeWidth="5" strokeLinecap="round" />
          </g>
        ))}

        {/* factory */}
        <g>
          {[
            { x: 68, w: 26, h: 62 },
            { x: 104, w: 26, h: 82 },
            { x: 140, w: 26, h: 52 },
          ].map((s, i) => (
            <g key={i}>
              <rect x={s.x} y={148 - s.h} width={s.w} height={s.h} rx="6" fill="url(#bldg)" />
              <rect
                x={s.x}
                y={148 - s.h}
                width={s.w}
                height={s.h}
                rx="6"
                fill="none"
                stroke="#04263B"
                strokeOpacity=".13"
              />
              <rect x={s.x} y={148 - s.h + 10} width={s.w} height="6" fill="#5EC2E8" opacity=".5" />
            </g>
          ))}
          <rect x="40" y="146" width="180" height="82" rx="10" fill="url(#bldg)" />
          <rect x="40" y="146" width="180" height="82" rx="10" fill="none" stroke="#04263B" strokeOpacity=".13" />
          <path d="M40,168 H220" stroke="#04263B" strokeOpacity=".1" strokeWidth="1.5" />
          <g fill="#5EC2E8" opacity=".6">
            {[58, 84, 110, 136, 162, 188].map((x) => (
              <rect key={x} x={x} y="180" width="16" height="20" rx="3" />
            ))}
          </g>
          <rect x="94" y="204" width="46" height="24" rx="3" fill="#083C5C" opacity=".82" />
        </g>

        {/* container stacks */}
        <g>
          {[
            { x: 236, y: 196, f: '#FFFFFF' },
            { x: 236, y: 176, f: '#A9DEF2' },
            { x: 288, y: 196, f: '#5EC2E8' },
            { x: 340, y: 196, f: '#FFFFFF' },
            { x: 340, y: 176, f: '#F2765C' },
            { x: 392, y: 196, f: '#A9DEF2' },
          ].map((c, i) => (
            <g key={i}>
              <rect x={c.x} y={c.y} width={48} height={20} rx="2.5" fill={c.f} />
              <rect x={c.x} y={c.y} width={48} height={20} rx="2.5" fill="none" stroke="#04263B" strokeOpacity=".14" />
            </g>
          ))}
        </g>

        {/* quay */}
        <rect x="20" y="226" width="424" height="20" rx="6" fill="url(#quay)" />
        <rect x="20" y="226" width="424" height="6" rx="3" fill="#EAF6FC" />
      </g>
    </svg>
  );
}

export function Smoke({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 80 120" className={className} aria-hidden="true">
      <g fill="#FFFFFF">
        {[
          { cx: 38, cy: 96, r: 11, o: 0.75, d: 0 },
          { cx: 46, cy: 72, r: 14, o: 0.6, d: 1.1 },
          { cx: 34, cy: 46, r: 17, o: 0.42, d: 2.2 },
          { cx: 44, cy: 20, r: 20, o: 0.22, d: 3.3 },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} opacity={p.o}>
            <animate
              attributeName="cy"
              values={`${p.cy};${p.cy - 16};${p.cy}`}
              dur="6s"
              begin={`${delay + p.d}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values={`${p.o};${p.o * 0.45};${p.o}`}
              dur="6s"
              begin={`${delay + p.d}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}

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

export function Plane({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 90" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fuse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#CFE7F4" />
        </linearGradient>
      </defs>
      <g>
        <path d="M18,52 L64,34 L84,42 L44,62 Z" fill="#A9DEF2" />
        <path d="M172,46 c0,7 -8,12 -20,13 l-118,4 c-14,1 -22,-6 -22,-13 s8,-14 22,-13 l118,4 c12,1 20,6 20,13 z" fill="url(#fuse)" />
        <path d="M172,46 c0,7 -8,12 -20,13 l-118,4 c-14,1 -22,-6 -22,-13 s8,-14 22,-13 l118,4 c12,1 20,6 20,13 z" fill="none" stroke="#04263B" strokeOpacity=".14" />
        <path d="M60,44 L104,16 L118,20 L92,46 Z" fill="#FFFFFF" stroke="#04263B" strokeOpacity=".12" />
        <path d="M24,42 L44,20 L54,22 L38,44 Z" fill="#0E6E9E" />
        <rect x="120" y="41" width="34" height="6" rx="3" fill="#F2765C" />
        <circle cx="164" cy="45" r="4" fill="#5EC2E8" />
      </g>
    </svg>
  );
}

export function DocCard({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 320" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E9F5FB" />
        </linearGradient>
        <filter id="paperShadow" x="-25%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#04263B" floodOpacity="0.2" />
        </filter>
      </defs>
      <g filter="url(#paperShadow)">
        <rect x="24" y="34" width="212" height="262" rx="18" fill="url(#paper)" />
        <rect x="24" y="34" width="212" height="262" rx="18" fill="none" stroke="#04263B" strokeOpacity=".1" />
        <circle cx="130" cy="34" r="15" fill="none" stroke="#F2765C" strokeWidth="7" />
        <rect x="48" y="66" width="86" height="9" rx="4.5" fill="#0E6E9E" opacity=".85" />
        {[104, 142, 180, 218, 256].map((y, i) => (
          <g key={y}>
            <circle cx="64" cy={y} r="13" fill={i < 4 ? '#5EC2E8' : '#DCEEF8'} />
            {i < 4 && (
              <path
                d={`M57,${y} l5,5 9,-10`}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <rect x="90" y={y - 5} width={i % 2 ? 108 : 82} height="9" rx="4.5" fill="#04263B" opacity=".16" />
          </g>
        ))}
      </g>
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
