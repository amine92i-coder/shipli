import { Link } from 'react-router-dom';

/** Wordmark echoing the SHIPLI logo: a plane and a ship tracing one circular route. */
export function Logo({ light = false }: { light?: boolean }) {
  const ink = light ? '#F5FAFD' : '#04263B';
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="SHIPLI home" data-testid="link-logo">
      <svg viewBox="0 0 44 44" className="h-9 w-9 shrink-0" aria-hidden="true">
        <path
          d="M9 30a15 15 0 0 1 8-22"
          fill="none"
          stroke={ink}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity=".55"
        />
        <path
          d="M35 14a15 15 0 0 1-8 22"
          fill="none"
          stroke={ink}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity=".55"
        />
        <g className="origin-center transition-transform duration-500 group-hover:rotate-[14deg]">
          <path d="M18 8.5 26 5l-2.6 5.4 4.6 1-9 3.4-3.2-2.6 2.6-.8Z" fill="#0E6E9E" />
          <path d="M16 33.5h11l2.4-3.6h-4.2l-.5-3.4h-3l.4 3.4h-3.6Z" fill="#04263B" />
          <path d="M13 34.4c1.7 1.2 3.1 1.2 4.8 0 1.7 1.2 3.1 1.2 4.8 0 1.7 1.2 3.1 1.2 4.8 0" fill="none" stroke="#1D96C9" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="font-sans text-[1.2rem] font-extrabold tracking-[0.16em]"
          style={{ color: ink }}
        >
          SHIPLI
        </span>
        <span
          className="mt-0.5 font-mono text-[8px] tracking-[0.3em]"
          style={{ color: light ? '#5EC2E8' : '#0E6E9E' }}
        >
          ONLY FOR YOU
        </span>
      </span>
    </Link>
  );
}
