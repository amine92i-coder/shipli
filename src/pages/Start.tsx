import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Paperclip, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT } from '@/data/content';

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

const PRODUCT_TYPES = [
  'Furniture & fit-out',
  'Construction & industrial machinery',
  'Custom manufacturing / private label',
  'Textiles & apparel',
  'Packaging & printing',
  'Electronics & POS hardware',
  'Other',
];

const STEPS: Step[] = [
  {
    id: 'company',
    title: 'First, are you buying as a company?',
    intro: 'This decides which contract we draft and how customs will treat the shipment in Morocco.',
    fields: [
      {
        name: 'registered',
        label: 'Is your business registered?',
        type: 'radio',
        options: ['Yes, registered in Morocco', 'Yes, registered outside Morocco', 'Not yet registered', 'Individual buyer'],
      },
      {
        name: 'importer',
        label: 'Can you import under your own name?',
        type: 'radio',
        options: ['Yes, we import regularly', 'Yes, but we have never done it', 'No — we need SHIPLI to import for us', 'Not sure'],
      },
    ],
  },
  {
    id: 'product',
    title: 'What are you sourcing?',
    fields: [
      { name: 'productType', label: 'Product category', type: 'radio', options: PRODUCT_TYPES },
      {
        name: 'productOther',
        label: 'Describe the category',
        type: 'text',
        optional: true,
        placeholder: 'Only if you picked “Other”',
      },
    ],
  },
  {
    id: 'furniture',
    title: 'Tell us about the fit-out',
    when: (a) => a.productType === 'Furniture & fit-out',
    fields: [
      {
        name: 'furnitureUse',
        label: 'What is the furniture for?',
        type: 'radio',
        options: ['Private villa or apartment', 'Hotel or riad', 'Office', 'Restaurant or café', 'Retail space', 'Resale / distribution'],
      },
      {
        name: 'buyerProfile',
        label: 'Who is briefing us?',
        type: 'radio',
        options: ['Architect or interior designer', 'Contractor / fit-out company', 'End client', 'Retailer or distributor'],
      },
      { name: 'roomCount', label: 'How many rooms or units?', type: 'number', placeholder: 'e.g. 24', optional: true },
      {
        name: 'projectStage',
        label: 'Where is the project today?',
        type: 'radio',
        options: ['Still designing', 'Drawings finished, choosing suppliers', 'Under construction', 'Ready to install'],
      },
      {
        name: 'floorPlan',
        label: 'Floor plan or mood board',
        type: 'file',
        optional: true,
        help: 'PDF, DWG, images — anything that shows what you are furnishing.',
      },
    ],
  },
  {
    id: 'machinery',
    title: 'Tell us about the equipment',
    when: (a) => a.productType === 'Construction & industrial machinery',
    fields: [
      {
        name: 'machineryKind',
        label: 'What exactly do you need?',
        type: 'radio',
        options: ['A single machine', 'A full production line', 'Spare parts or components', 'Hardware & tooling'],
      },
      {
        name: 'techSheet',
        label: 'Technical sheet or BOQ',
        type: 'file',
        optional: true,
        help: 'Specifications, bill of quantities, or a competing quotation.',
      },
      {
        name: 'machineryContext',
        label: 'What will it produce, and at what capacity?',
        type: 'textarea',
        placeholder: 'Output per hour, voltage, footprint, certifications required…',
        optional: true,
      },
    ],
  },
  {
    id: 'custom',
    title: 'Tell us about the product to manufacture',
    when: (a) => a.productType === 'Custom manufacturing / private label',
    fields: [
      {
        name: 'customDescription',
        label: 'Describe the product',
        type: 'textarea',
        placeholder: 'Materials, dimensions, finish, function, the closest product on the market…',
      },
      {
        name: 'customPackaging',
        label: 'Do you need custom packaging and branding?',
        type: 'radio',
        options: ['Yes — logo, packaging, inserts', 'Logo on product only', 'Neutral packaging is fine', 'Not decided yet'],
      },
      {
        name: 'packagingSpecs',
        label: 'Packaging or branding specifications',
        type: 'textarea',
        optional: true,
        placeholder: 'Retail carton, barcode, language on the label, market requirements…',
      },
      { name: 'referenceFiles', label: 'Reference files', type: 'file', optional: true, help: 'Drawings, samples, photos, logo files.' },
    ],
  },
  {
    id: 'generic',
    title: 'Tell us about the product',
    when: (a) =>
      !!a.productType &&
      !['Furniture & fit-out', 'Construction & industrial machinery', 'Custom manufacturing / private label'].includes(
        a.productType as string,
      ),
    fields: [
      {
        name: 'genericDescription',
        label: 'Describe what you want to source',
        type: 'textarea',
        placeholder: 'Product, material, specification, the quality level you are targeting…',
      },
      { name: 'referenceFiles', label: 'Reference files', type: 'file', optional: true, help: 'Photos, drawings, links, existing quotations.' },
    ],
  },
  {
    id: 'volume',
    title: 'Quantity and budget',
    intro: 'Rough numbers are fine. They tell us which factories can actually take the order.',
    fields: [
      { name: 'quantity', label: 'Quantity for the first order', type: 'text', placeholder: 'e.g. 500 units, 2 containers, 1 line' },
      {
        name: 'monthlyVolume',
        label: 'Expected volume after that',
        type: 'radio',
        options: ['One-off order', 'A few orders a year', 'Monthly repeat orders', 'Weekly / continuous supply'],
      },
      {
        name: 'budget',
        label: 'Budget for this order (USD)',
        type: 'radio',
        options: ['Under $5,000', '$5,000 – $20,000', '$20,000 – $50,000', '$50,000 – $150,000', 'Above $150,000', 'Need help estimating'],
      },
      {
        name: 'timeline',
        label: 'When do you need it delivered?',
        type: 'radio',
        options: ['As fast as possible', 'Within 1–2 months', 'Within 3–6 months', 'Planning ahead, no fixed date'],
      },
    ],
  },
  {
    id: 'service',
    title: 'How do you want us to work?',
    fields: [
      {
        name: 'serviceMode',
        label: 'Pick the sourcing model',
        type: 'radio',
        options: [
          'Full DDP — you handle everything to my door',
          'Sourcing only — I arrange my own freight',
          'Shipping & customs only — I already have a supplier',
          'Visit factories in China with your team',
          'Not sure, advise me',
        ],
      },
      {
        name: 'tasks',
        label: 'What should we take on?',
        type: 'checkbox',
        options: [
          'Product research',
          'Factory identification & vetting',
          'Price negotiation',
          'Sample management',
          'Quality control & inspection',
          'Freight & logistics',
          'Customs clearance in Morocco',
          'Branding & packaging',
          'Company setup in China',
        ],
      },
      {
        name: 'updates',
        label: 'How often do you want updates?',
        type: 'radio',
        options: ['At every milestone', 'Weekly summary', 'Only when something needs a decision'],
      },
    ],
  },
  {
    id: 'travel',
    title: 'Your trip to China',
    when: (a) => a.serviceMode === 'Visit factories in China with your team',
    fields: [
      { name: 'travelDate', label: 'Approximate travel date', type: 'date', optional: true },
      { name: 'partySize', label: 'How many people are travelling?', type: 'number', placeholder: 'e.g. 2', optional: true },
      {
        name: 'stayDuration',
        label: 'How long will you stay?',
        type: 'radio',
        options: ['2–3 days', 'About a week', 'Two weeks or more', 'Not decided'],
      },
      {
        name: 'tripSupport',
        label: 'What support do you need on the ground?',
        type: 'checkbox',
        options: ['Invitation letter / visa support', 'Interpreter', 'Hotel & transport', 'Factory appointments', 'Trade fair access'],
      },
    ],
  },
  {
    id: 'context',
    title: 'Context that helps us quote',
    fields: [
      {
        name: 'existingSupplier',
        label: 'Do you already have a supplier in China?',
        type: 'radio',
        options: ['No, we are starting from zero', 'Yes, but we want a better price', 'Yes, and we are happy — we only need logistics', 'We had one and it went badly'],
      },
      {
        name: 'projectContext',
        label: 'Anything else we should know?',
        type: 'textarea',
        optional: true,
        placeholder: 'Certifications, competitors, past import problems, deadlines that cannot move…',
      },
    ],
  },
  {
    id: 'you',
    title: 'Where do we send the quotation?',
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text' },
      { name: 'companyName', label: 'Company name', type: 'text', optional: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'WhatsApp / phone', type: 'tel', placeholder: '+212 …' },
      { name: 'city', label: 'City', type: 'text', optional: true, placeholder: 'Casablanca, Tanger, Marrakech…' },
    ],
  },
];

export default function Start() {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [done, setDone] = useState(false);

  const steps = useMemo(() => STEPS.filter((step) => !step.when || step.when(answers)), [answers]);
  const step = steps[Math.min(index, steps.length - 1)];
  const progress = ((index + 1) / steps.length) * 100;

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

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-abyss pb-24 pt-32 text-shell sm:pt-40">
      <div className="dot-grid absolute inset-0 opacity-15" />
      <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-sea/25 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-wave/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-9 bg-coral" />
          <p className="eyebrow text-sky">Sourcing request</p>
        </div>
        <h1 className="display mt-5 text-[clamp(2rem,5vw,3.25rem)] text-shell">
          Give us the brief. We come back with a landed cost.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-mist/70">
          A few short steps. Every answer changes the questions that follow, so you only fill what applies to you.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.12]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky to-coral transition-[width] duration-500 ease-out"
              style={{ width: `${done ? 100 : progress}%` }}
            />
          </div>
          <span className="font-mono text-[11px] tracking-[0.16em] text-mist/60">
            {done ? 'DONE' : `${index + 1} / ${steps.length}`}
          </span>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/[0.12] bg-white/[0.05] p-7 backdrop-blur-md sm:p-10">
          {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kelp/20 text-kelp">
                  <Check size={26} />
                </span>
                <h2 className="display mt-7 text-3xl text-shell sm:text-4xl">Brief received.</h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-mist/75">
                  This form is not connected to a backend yet, so nothing was transmitted. Copy your answers below and
                  send them to{' '}
                  <a href={`mailto:${CONTACT.email}`} className="font-bold text-sky underline underline-offset-4">
                    {CONTACT.email}
                  </a>
                  , or call the Morocco desk on{' '}
                  <a href={`tel:${CONTACT.moroccoPhone.replace(/[^+\d]/g, '')}`} className="font-bold text-sky">
                    {CONTACT.moroccoPhone}
                  </a>
                  .
                </p>

                <dl className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-abyss/50 p-5">
                  {Object.entries(answers)
                    .filter(([, value]) => (Array.isArray(value) ? value.length : value))
                    .map(([key, value]) => (
                      <div key={key} className="grid gap-1 sm:grid-cols-[.5fr_1fr] sm:gap-4">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist/45">{label(key)}</dt>
                        <dd className="text-sm text-shell">{Array.isArray(value) ? value.join(', ') : value}</dd>
                      </div>
                    ))}
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Sourcing request')}&body=${encodeURIComponent(
                      Object.entries(answers)
                        .filter(([, value]) => (Array.isArray(value) ? value.length : value))
                        .map(([key, value]) => `${label(key)}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join('\n'),
                    )}`}
                    className="btn-primary"
                  >
                    Email this brief
                    <Send size={15} />
                  </a>
                  <Link to="/" className="btn-ghost border-white/20 bg-white/5 text-shell hover:bg-white/15">
                    Back to homepage
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
                <p className="eyebrow text-sky">Step {String(index + 1).padStart(2, '0')}</p>
                <h2 className="display mt-4 text-2xl text-shell sm:text-3xl">{step.title}</h2>
                {step.intro && <p className="mt-3 max-w-lg text-sm leading-7 text-mist/65">{step.intro}</p>}

                <div className="mt-9 space-y-8">
                  {step.fields.map((field) => (
                    <FieldBlock
                      key={field.name}
                      field={field}
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
                    <ArrowLeft size={15} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={!complete}
                    className="btn-primary disabled:pointer-events-none disabled:opacity-35"
                  >
                    {index === steps.length - 1 ? 'Send my brief' : 'Continue'}
                    {index === steps.length - 1 ? <ArrowUpRight size={16} /> : <ArrowRight size={16} />}
                  </button>
                </div>
            </motion.div>
          )}
        </div>

        {!done && (
          <p className="mt-6 text-center text-xs text-mist/45">
            Prefer to talk first? Call {CONTACT.moroccoPhone} or write to {CONTACT.email}.
          </p>
        )}
      </div>
    </section>
  );
}

function FieldBlock({
  field,
  value,
  onSet,
  onToggle,
}: {
  field: Field;
  value: string | string[] | undefined;
  onSet: (value: string) => void;
  onToggle: (option: string) => void;
}) {
  const legend = (
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-bold text-shell">{field.label}</span>
      {field.optional && <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist/40">Optional</span>}
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
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition duration-300 ${
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
            onChange={(event) =>
              onSet(Array.from(event.target.files ?? []).map((file) => file.name).join(', ') || '')
            }
            className="w-full text-xs text-mist/70 file:mr-3 file:rounded-full file:border-0 file:bg-sky/20 file:px-4 file:py-2 file:text-xs file:font-bold file:text-sky"
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
        onChange={(event) => onSet(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-shell outline-none transition placeholder:text-mist/35 focus:border-sky/60 focus:bg-white/[0.07]"
      />
    </label>
  );
}

function label(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
