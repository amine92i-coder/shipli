import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';

/**
 * The language layer's public surface.
 *
 * `Content` is derived from the English object rather than declared by hand.
 * That is deliberate: a hand-written interface for a dictionary this size would
 * drift from the copy within a week, and the drift would be silent. Deriving it
 * means the shape of the site's copy IS the type, so fr.ts and ar.ts — both
 * annotated `: Content` — fail the build the moment a key is missing or
 * misspelled. A translator can never ship a blank section by accident.
 *
 * en.ts must therefore stay a plain object. `as const` there would widen every
 * value into a string literal type and make "Accueil" un-assignable to 'Home'.
 */
export type Content = typeof en;

export type Lang = 'en' | 'fr' | 'ar';

export const LANGS: Lang[] = ['en', 'fr', 'ar'];

export const dictionaries: Record<Lang, Content> = { en, fr, ar };

/**
 * Fills {name} placeholders. Kept deliberately dumb — no pluralisation engine,
 * no ICU. The three languages disagree about plurals (Arabic has six forms),
 * so anywhere a count changes the wording, the dictionary carries the whole
 * sentence rather than a fragment plus a rule.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * The locale to hand `Intl` for anything numeric — dates, currency, quantities.
 *
 * Arabic gets the `-u-nu-latn` extension so figures come out as 1 200 rather
 * than ١٢٠٠. This is a judgement about this particular audience, not about
 * Arabic: Moroccan invoices, customs declarations and supplier quotations are
 * all written in Western numerals, and a landed cost the reader cannot line up
 * against the quote in their other hand is worse than no number at all. Eastern
 * Arabic numerals are correct in the Gulf; they would be wrong here.
 */
export function numericLocale(locale: string): string {
  return locale.startsWith('ar') ? `${locale}-u-nu-latn` : locale;
}

/**
 * Wraps a value in Unicode isolate marks so the bidi algorithm treats it as a
 * self-contained left-to-right run.
 *
 * Needed wherever a Latin token — a phone number, an email address — is
 * substituted into an Arabic sentence. Left alone, "+212 6…" renders with the
 * plus sign flung to the far end of the number and the reader cannot tell where
 * the number starts. This is the plain-string equivalent of `<span dir="ltr">`,
 * for the places where the sentence is assembled by fill() and there is no
 * element to hang an attribute on.
 */
export function ltr(value: string): string {
  return `⁦${value}⁩`;
}

export { en, fr, ar };
