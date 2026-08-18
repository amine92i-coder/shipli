import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Paperclip, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT } from '@/data/content';
import { useT } from '@/i18n/LangContext';
import { dictionaries, fill, LANGS, ltr, type Content } from '@/i18n';

/**
 * The three stages your brief passes through, in our own photographs.
 * Only the file paths live here — the caption and the alt text are prose and
 * come from the dictionary, zipped on by position.
 */
const SHOT_SRCS = [
  '/images/gallery/gallery-16.jpg',
  '/images/gallery/gallery-10.jpg',
  '/images/gallery/gallery-14.jpg',
];

type FieldType = 'radio' | 'checkbox' | 'text' | 'textarea' | 'email' | 'tel' | 'number' | 'date' | 'file';

type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  optional?: boolean;
  help?: string;
};

type Step = {
  id: string;
  title: string;
  intro?: string;
  fields: Field[];
  when?: (a: Answers) => boolean;
};

type Answers = Record<string, string | string[]>;

/**
 * True when `answer` is the option at `index` of `pick(dictionary)` in ANY of
 * the three languages.
 *
 * The branch predicates cannot just compare against the active dictionary. A
 * visitor who picks "Furniture & fit-out" in English and then switches to
 * French halfway through still has the English string sitting in their answers;
 * comparing against the French label alone would collapse the furniture branch,
 * strand everything they had already typed in it, and renumber the steps under
 * their feet. Matching across all three languages keeps the form standing when
 * the language changes beneath it.
 *
 * Comparing by position rather than by text is the other half of that: the
 * dictionaries are parallel arrays, so option 0 is the same option in every
 * language even though the three strings share no characters.
 */
function matchesOption(answer: Answers[string] | undefined, pick: (d: Content) => string[], index: number) {
  if (typeof answer !== 'string') return false;
  return LANGS.some((code) => pick(dictionaries[code])[index] === answer);
}

const PRODUCT_TYPES = (d: Content) => d.start.productTypes;
const SERVICE_MODES = (d: Content) => d.start.steps.service.modeOptions;

/**
 * Built from the dictionary on every language change rather than declared once
 * at module scope, because every label, option and placeholder in it is prose.
 * What is NOT prose — the field `name` the answers map is keyed by, the input
 * `type`, and which step is conditional on what — stays hard-coded here, so a
 * translation can never break the form's logic.
 */
function buildSteps(t: Content): Step[] {
  const s = t.start.steps;
  return [
    {
      id: 'company',
      title: s.company.title,
      intro: s.company.intro,
      fields: [
        { name: 'registered', label: s.company.registered, type: 'radio', options: s.company.registeredOptions },
        { name: 'importer', label: s.company.importer, type: 'radio', options: s.company.importerOptions },
      ],
    },
    {
      id: 'product',
      title: s.product.title,
      fields: [
        { name: 'productType', label: s.product.productType, type: 'radio', options: t.start.productTypes },
        {
          name: 'productOther',
          label: s.product.productOther,
          type: 'text',
          optional: true,
          placeholder: s.product.productOtherPlaceholder,
        },
      ],
    },
    {
      id: 'furniture',
      title: s.furniture.title,
      when: (a) => matchesOption(a.productType, PRODUCT_TYPES, 0),
      fields: [
        { name: 'furnitureUse', label: s.furniture.use, type: 'radio', options: s.furniture.useOptions },
        { name: 'buyerProfile', label: s.furniture.profile, type: 'radio', options: s.furniture.profileOptions },
        {
          name: 'roomCount',
          label: s.furniture.rooms,
          type: 'number',
          placeholder: s.furniture.roomsPlaceholder,
          optional: true,
        },
        { name: 'projectStage', label: s.furniture.stage, type: 'radio', options: s.furniture.stageOptions },
        { name: 'floorPlan', label: s.furniture.plan, type: 'file', optional: true, help: s.furniture.planHelp },
      ],
    },
    {
      id: 'machinery',
      title: s.machinery.title,
      when: (a) => matchesOption(a.productType, PRODUCT_TYPES, 1),
      fields: [
        { name: 'machineryKind', label: s.machinery.kind, type: 'radio', options: s.machinery.kindOptions },
        { name: 'techSheet', label: s.machinery.sheet, type: 'file', optional: true, help: s.machinery.sheetHelp },
        {
          name: 'machineryContext',
          label: s.machinery.context,
          type: 'textarea',
          placeholder: s.machinery.contextPlaceholder,
          optional: true,
        },
      ],
    },
    {
      id: 'custom',
      title: s.custom.title,
      when: (a) => matchesOption(a.productType, PRODUCT_TYPES, 2),
      fields: [
        {
          name: 'customDescription',
          label: s.custom.description,
          type: 'textarea',
          placeholder: s.custom.descriptionPlaceholder,
        },
        { name: 'customPackaging', label: s.custom.packaging, type: 'radio', options: s.custom.packagingOptions },
        {
          name: 'packagingSpecs',
          label: s.custom.specs,
          type: 'textarea',
          optional: true,
          placeholder: s.custom.specsPlaceholder,
        },
        { name: 'referenceFiles', label: s.custom.files, type: 'file', optional: true, help: s.custom.filesHelp },
      ],
    },
    {
      id: 'generic',
      title: s.generic.title,
      /* Everything that is not one of the three specialised branches above. */
      when: (a) => !!a.productType && ![0, 1, 2].some((i) => matchesOption(a.productType, PRODUCT_TYPES, i)),
      fields: [
        {
          name: 'genericDescription',
          label: s.generic.description,
          type: 'textarea',
          placeholder: s.generic.descriptionPlaceholder,
        },
        { name: 'referenceFiles', label: s.generic.files, type: 'file', optional: true, help: s.generic.filesHelp },
      ],
    },
    {
      id: 'volume',
      title: s.volume.title,
      intro: s.volume.intro,
      fields: [
        { name: 'quantity', label: s.volume.quantity, type: 'text', placeholder: s.volume.quantityPlaceholder },
        { name: 'monthlyVolume', label: s.volume.monthly, type: 'radio', options: s.volume.monthlyOptions },
        { name: 'budget', label: s.volume.budget, type: 'radio', options: s.volume.budgetOptions },
        { name: 'timeline', label: s.volume.timeline, type: 'radio', options: s.volume.timelineOptions },
      ],
    },
    {
      id: 'service',
      title: s.service.title,
      fields: [
        { name: 'serviceMode', label: s.service.mode, type: 'radio', options: s.service.modeOptions },
        { name: 'tasks', label: s.service.tasks, type: 'checkbox', options: s.service.tasksOptions },
        { name: 'updates', label: s.service.updates, type: 'radio', options: s.service.updatesOptions },
      ],
    },
    {
      id: 'travel',
      title: s.travel.title,
      when: (a) => matchesOption(a.serviceMode, SERVICE_MODES, 3),
      fields: [
        { name: 'travelDate', label: s.travel.date, type: 'date', optional: true },
        {
          name: 'partySize',
          label: s.travel.party,
          type: 'number',
          placeholder: s.travel.partyPlaceholder,
          optional: true,
        },
        { name: 'stayDuration', label: s.travel.stay, type: 'radio', options: s.travel.stayOptions },
        { name: 'tripSupport', label: s.travel.support, type: 'checkbox', options: s.travel.supportOptions },
      ],
    },
    {
      id: 'context',
      title: s.context.title,
      fields: [
        { name: 'existingSupplier', label: s.context.supplier, type: 'radio', options: s.context.supplierOptions },
        {
          name: 'projectContext',
          label: s.context.notes,
          type: 'textarea',
          optional: true,
          placeholder: s.context.notesPlaceholder,
        },
      ],
    },
    {
      id: 'you',
      title: s.you.title,
      fields: [
        { name: 'fullName', label: s.you.fullName, type: 'text' },
        { name: 'companyName', label: s.you.companyName, type: 'text', optional: true },
        { name: 'email', label: s.you.email, type: 'email' },
        { name: 'phone', label: s.you.phone, type: 'tel', placeholder: '+212 …' },
        { name: 'city', label: s.you.city, type: 'text', optional: true, placeholder: s.you.cityPlaceholder },
      ],
    },
  ];
}

/**
 * Rewrites the stored answers into the language now on screen.
 *
 * `matchesOption` keeps the STEPS standing when the language changes, but the
 * answers themselves are still the strings the visitor clicked, and every option
 * button decides whether to look selected by comparing itself against them. So
 * after a switch the branch was right and the highlight was gone: step 03 asked
 * its furniture questions while step 02 showed nothing chosen, because
 * "الأثاث والتجهيز الداخلي" is not "Mobilier et aménagement". The answer was
 * never lost — it just stopped being legible to the control that set it.
 *
 * Left alone it also submits that way: a form filled half in Arabic and half in
 * French, arriving as a mix of both.
 *
 * The rewrite goes through the option's INDEX, which is the only thing the three
 * dictionaries share — build the same steps in every language, learn what
 * position each string sits at, then emit the string the active language keeps at
 * that position. Anything with no options is free text the visitor typed, and is
 * copied across untouched; translating what someone wrote themselves would be a
 * far worse bug than the one this fixes.
 */
function translateAnswers(answers: Answers, to: Content): Answers {
  const target = new Map<string, string[]>();
  buildSteps(to).forEach((s) => s.fields.forEach((f) => f.options && target.set(f.name, f.options)));

  // Every option string in every language, mapped to its position.
  const positionOf = new Map<string, Map<string, number>>();
  LANGS.forEach((code) => {
    buildSteps(dictionaries[code]).forEach((s) =>
      s.fields.forEach((f) => {
        if (!f.options) return;
        let m = positionOf.get(f.name);
        if (!m) positionOf.set(f.name, (m = new Map()));
        f.options.forEach((option, i) => m!.set(option, i));
      }),
    );
  });

  const out: Answers = {};
  for (const [name, value] of Object.entries(answers)) {
    const index = positionOf.get(name);
    const options = target.get(name);
    if (!index || !options) {
      out[name] = value;
      continue;
    }
    const convert = (s: string) => {
      const i = index.get(s);
      return i === undefined ? s : options[i] ?? s;
    };
    out[name] = Array.isArray(value) ? value.map(convert) : convert(value);
  }
  return out;
}

export default function Start() {
  const t = useT();
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [done, setDone] = useState(false);

  /* Runs on language change only — `answers` is empty on mount, so the first
     pass is a no-op, and re-running it on an unchanged `t` would be harmless
     anyway since translating an already-translated answer is the identity. */
  useEffect(() => {
    setAnswers((prev) => (Object.keys(prev).length ? translateAnswers(prev, t) : prev));
  }, [t]);

  const allSteps = useMemo(() => buildSteps(t), [t]);
  const steps = useMemo(() => allSteps.filter((step) => !step.when || step.when(answers)), [allSteps, answers]);
  const step = steps[Math.min(index, steps.length - 1)];
  const progress = ((index + 1) / steps.length) * 100;

  /**
   * The summary is built by walking the answers map, which is keyed by field
   * name, so the labels are looked up by the same key. The old code derived
   * them by de-camel-casing ("productType" → "Product Type"), which could only
   * ever produce English. The cast is to index a fixed-key object with a string
   * that comes from Object.entries; the fallback covers a key with no label.
   */
  const fieldLabels = t.start.fieldLabels as Record<string, string>;
  const label = (key: string) => fieldLabels[key] ?? key;

  const set = (name: string, value: string | string[]) => setAnswers((prev) => ({ ...prev, [name]: value }));

  const toggle = (name: string, option: string) => {
    const current = (answers[name] as string[]) ?? [];
    set(name, current.includes(option) ? current.filter((v) => v !== option) : [...current, option]);
  };

  const complete = step.fields
    .filter((field) => !field.optional && field.type !== 'file')
    .every((field) => {
      const value = answers[field.name];
      return Array.isArray(value) ? value.length > 0 : !!value;
    });

  const next = () => {
    if (index === steps.length - 1) {
      setDone(true);
      return;
    }
    setDirection(1);
    setIndex((i) => i + 1);
  };

  const back = () => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  };

  const filled = Object.entries(answers).filter(([, value]) => (Array.isArray(value) ? value.length : value));

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-abyss pb-24 pt-32 text-shell sm:pt-40">
      <div className="dot-grid absolute inset-0 opacity-15" />
      <div className="absolute -start-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-sea/25 blur-3xl" />
      <div className="absolute -end-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-wave/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-9 bg-coral" />
          <p className="eyebrow text-sky">{t.start.eyebrow}</p>
        </div>
        <h1 className="display mt-5 text-[clamp(2rem,5vw,3.25rem)] text-shell">{t.start.title}</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-mist/70">{t.start.intro}</p>

        {/* What actually happens to the brief once it is sent — real photographs
            rather than a promise, sitting above the first question. */}
        <ul className="mt-9 grid grid-cols-3 gap-2.5 sm:gap-3">
          {SHOT_SRCS.map((src, i) => (
            <li key={src} className="group relative overflow-hidden rounded-2xl border border-white/10">
              <img
                src={src}
                alt={t.start.shots[i].alt}
                loading={i === 0 ? undefined : 'lazy'}
                className="aspect-[4/5] w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-100 sm:aspect-[4/3]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/25 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 font-mono text-[9px] uppercase leading-4 tracking-[0.14em] text-mist/85 sm:text-[10px]">
                {t.start.shots[i].label}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center gap-4">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.12]">
            {/* The fill grows from the inline start, so in Arabic it grows
                rightwards and the gradient has to run the other way with it. */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky to-coral transition-[width] duration-500 ease-out rtl:bg-gradient-to-l"
              style={{ width: `${done ? 100 : progress}%` }}
            />
          </div>
          <span className="font-mono text-[11px] tracking-[0.16em] text-mist/60" dir="ltr">
            {done ? t.start.done : fill(t.start.stepCounter, { n: index + 1, total: steps.length })}
          </span>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/[0.12] bg-white/[0.05] p-7 backdrop-blur-md sm:p-10">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kelp/20 text-kelp">
                <Check size={26} />
              </span>
              <h2 className="display mt-7 text-3xl text-shell sm:text-4xl">{t.start.doneTitle}</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-mist/75">
                {t.start.doneBodyA}{' '}
                <a href={`mailto:${CONTACT.email}`} className="font-bold text-sky underline underline-offset-4" dir="ltr">
                  {CONTACT.email}
                </a>
                {t.start.doneBodyB}{' '}
                <a href={`tel:${CONTACT.moroccoPhone.replace(/[^+\d]/g, '')}`} className="font-bold text-sky" dir="ltr">
                  {CONTACT.moroccoPhone}
                </a>
                .
              </p>

              <dl className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-abyss/50 p-5">
                {filled.map(([key, value]) => (
                  <div key={key} className="grid gap-1 sm:grid-cols-[.5fr_1fr] sm:gap-4">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist/45">{label(key)}</dt>
                    <dd className="text-sm text-shell">{Array.isArray(value) ? value.join('، ') : value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(t.start.emailSubject)}&body=${encodeURIComponent(
                    filled.map(([key, value]) => `${label(key)}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n'),
                  )}`}
                  className="btn-primary"
                >
                  {t.start.emailBrief}
                  <Send size={15} className="rtl:-scale-x-100" />
                </a>
                <Link to="/" className="btn-ghost border-white/20 bg-white/5 text-shell hover:bg-white/15">
                  {t.start.backHome}
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
            >
              <p className="eyebrow text-sky">
                {fill(t.start.stepKicker, { n: String(index + 1).padStart(2, '0') })}
              </p>
              <h2 className="display mt-4 text-2xl text-shell sm:text-3xl">{step.title}</h2>
              {step.intro && <p className="mt-3 max-w-lg text-sm leading-7 text-mist/65">{step.intro}</p>}

              <div className="mt-9 space-y-8">
                {step.fields.map((field) => (
                  <FieldBlock
                    key={field.name}
                    field={field}
                    optionalLabel={t.start.optional}
                    value={answers[field.name]}
                    onSet={(value) => set(field.name, value)}
                    onToggle={(option) => toggle(field.name, option)}
                  />
                ))}
              </div>

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-7">
                <button
                  type="button"
                  onClick={back}
                  disabled={index === 0}
                  className="inline-flex items-center gap-2 text-sm font-bold text-mist/65 transition hover:text-shell disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowLeft size={15} className="rtl:rotate-180" />
                  {t.start.back}
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!complete}
                  className="btn-primary disabled:pointer-events-none disabled:opacity-35"
                >
                  {index === steps.length - 1 ? t.start.submit : t.start.continue}
                  {index === steps.length - 1 ? (
                    <ArrowUpRight size={16} className="rtl:rotate-[-90deg]" />
                  ) : (
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {!done && (
          <p className="mt-6 text-center text-xs text-mist/45">
            {/* Isolated rather than wrapped in a span: fill() hands back a plain
                string, so the direction has to travel inside the value itself. */}
            {fill(t.start.prefer, { phone: ltr(CONTACT.moroccoPhone), email: ltr(CONTACT.email) })}
          </p>
        )}
      </div>
    </section>
  );
}

function FieldBlock({
  field,
  optionalLabel,
  value,
  onSet,
  onToggle,
}: {
  field: Field;
  optionalLabel: string;
  value: string | string[] | undefined;
  onSet: (value: string) => void;
  onToggle: (option: string) => void;
}) {
  const legend = (
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-bold text-shell">{field.label}</span>
      {field.optional && (
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist/40">{optionalLabel}</span>
      )}
    </div>
  );

  if (field.type === 'radio' || field.type === 'checkbox') {
    const multi = field.type === 'checkbox';
    const selected = multi ? ((value as string[]) ?? []) : [];
    return (
      <fieldset>
        {legend}
        {field.help && <p className="mt-1.5 text-xs text-mist/50">{field.help}</p>}
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {field.options?.map((option) => {
            const active = multi ? selected.includes(option) : value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => (multi ? onToggle(option) : onSet(option))}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-start text-sm transition duration-300 ${
                  active
                    ? 'border-sky/70 bg-sky/15 text-shell'
                    : 'border-white/[0.12] bg-white/[0.03] text-mist/75 hover:border-white/30 hover:bg-white/[0.07]'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border transition ${
                    multi ? 'rounded-md' : 'rounded-full'
                  } ${active ? 'border-sky bg-sky text-abyss' : 'border-white/25'}`}
                >
                  {active && <Check size={12} strokeWidth={3} />}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'textarea') {
    return (
      <label className="block">
        {legend}
        <textarea
          rows={4}
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(event) => onSet(event.target.value)}
          className="mt-3 w-full rounded-2xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-shell outline-none transition placeholder:text-mist/35 focus:border-sky/60 focus:bg-white/[0.07]"
        />
      </label>
    );
  }

  if (field.type === 'file') {
    return (
      <label className="block">
        {legend}
        {field.help && <p className="mt-1.5 text-xs text-mist/50">{field.help}</p>}
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-4">
          <Paperclip size={16} className="shrink-0 text-sky" />
          <input
            type="file"
            multiple
            onChange={(event) => onSet(Array.from(event.target.files ?? []).map((file) => file.name).join(', ') || '')}
            className="w-full text-xs text-mist/70 file:me-3 file:rounded-full file:border-0 file:bg-sky/20 file:px-4 file:py-2 file:text-xs file:font-bold file:text-sky"
          />
        </div>
      </label>
    );
  }

  return (
    <label className="block">
      {legend}
      <input
        type={field.type}
        value={(value as string) ?? ''}
        placeholder={field.placeholder}
        /* Phone and date entry stay LTR: a number typed right-to-left is not a
           number anyone can dial, and the date widget's own layout is LTR. */
        dir={field.type === 'tel' || field.type === 'date' || field.type === 'number' ? 'ltr' : undefined}
        onChange={(event) => onSet(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-shell outline-none transition placeholder:text-mist/35 focus:border-sky/60 focus:bg-white/[0.07]"
      />
    </label>
  );
}
