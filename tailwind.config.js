/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#04263B',
        deep: '#083C5C',
        sea: '#0E6E9E',
        wave: '#1D96C9',
        sky: '#5EC2E8',
        mist: '#A9DEF2',
        foam: '#E4F3FA',
        shell: '#F5FAFD',
        sand: '#F0D9A8',
        coral: '#F2765C',
        kelp: '#1FA890',
      },
      fontFamily: {
        // Cairo sits behind the Latin faces, not beside them. CSS resolves a
        // font stack per glyph, so Latin keeps landing on Manrope / JetBrains
        // and only Arabic falls through to Cairo — one stack, all three
        // languages, no conditional class. See the note in index.html.
        sans: ['Manrope', 'Cairo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Cairo', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        shell: '1280px',
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-14px,0)' },
        },
        sway: {
          '0%,100%': { transform: 'rotate(-1.2deg)' },
          '50%': { transform: 'rotate(1.2deg)' },
        },
        dash: {
          to: { strokeDashoffset: '-120' },
        },
        rise: {
          from: { opacity: '0', transform: 'translate3d(0,26px,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(.85)', opacity: '.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        drift: 'drift 7s ease-in-out infinite',
        sway: 'sway 5s ease-in-out infinite',
        dash: 'dash 3s linear infinite',
        rise: 'rise .9s cubic-bezier(.2,.7,.3,1) both',
        marquee: 'marquee 38s linear infinite',
        pulseRing: 'pulseRing 2.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
