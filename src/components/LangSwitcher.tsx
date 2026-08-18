import { LANGS } from '@/i18n';
import { useLang } from '@/i18n/LangContext';

/**
 * A three-way segmented control rather than a dropdown.
 *
 * With only three languages a select costs a click to discover and a click to
 * choose, and it hides the fact that Arabic exists at all — which is the one
 * thing a Moroccan visitor most needs to see immediately. Three visible chips
 * cost the same width as a dropdown once the caret is accounted for.
 *
 * `light` mirrors the Logo's prop: the header is transparent over the dark hero,
 * so the control has to invert there or it disappears into the water.
 */
export function LangSwitcher({ light = false, className = '' }: { light?: boolean; className?: string }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border p-0.5 transition-colors ${
        light ? 'border-white/25 bg-abyss/25 backdrop-blur' : 'border-sea/15 bg-white/70'
      } ${className}`}
      role="group"
      aria-label={t.meta.switchAria}
      data-testid="lang-switcher"
    >
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            /* The full language name is the accessible label; the chip only has room for a code. */
            aria-label={dictionaryLabel(code)}
            className={`min-w-[30px] rounded-full px-2 py-1 text-[11px] font-bold uppercase leading-4 tracking-wide transition ${
              active
                ? light
                  ? 'bg-shell text-abyss'
                  : 'bg-abyss text-shell'
                : light
                  ? 'text-shell/70 hover:text-shell'
                  : 'text-deep/60 hover:text-abyss'
            }`}
            data-testid={`lang-${code}`}
          >
            {SHORT[code]}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Deliberately not read from the active dictionary: a switcher that renamed its
 * own options every time you used it would be unusable. Each language is always
 * labelled in itself, which is the convention every multilingual site follows.
 */
const SHORT: Record<string, string> = { en: 'EN', fr: 'FR', ar: 'ع' };
const FULL: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية' };

function dictionaryLabel(code: string) {
  return FULL[code] ?? code;
}
