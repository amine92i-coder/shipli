import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plane, RotateCcw, Ship, Zap } from 'lucide-react';
import { useT } from '@/i18n/LangContext';
import { fill, numericLocale } from '@/i18n';

type Mode = 'sea' | 'air' | 'express';

/**
 * Indicative China → Casablanca rates per chargeable kilo. Sea is the blended
 * cost of an LCL cubic metre spread over a typical density; air and express are
 * all-in door rates. They are starting points — every real quote we send is
 * priced off the actual carton dimensions.
 *
 * Only the parts a translator must not touch live here: the id the state machine
 * switches on, the rate, and the icon. The name of the mode and its transit time
 * are prose and sit in the dictionaries, zipped on by position.
 */
const MODE_SPECS: { id: Mode; rate: number; icon: typeof Ship }[] = [
  { id: 'sea', rate: 1.4, icon: Ship },
  { id: 'air', rate: 6.5, icon: Plane },
  { id: 'express', rate: 9.8, icon: Zap },
];

const DEFAULTS = {
  mode: 'sea' as Mode,
  unitCost: 4.2,
  quantity: 1000,
  unitWeight: 350,
  freightRate: 1.4,
  dutyRate: 10,
  vatRate: 20,
  clearance: 350,
  agencyFee: 8,
  retailPrice: 13,
  fx: 9.9,
};

/**
 * Several inputs span three decades — quantity runs 10 to 50 000. On a linear
 * track a realistic 1 000-piece order sits 2% from the left and the thumb is
 * unusable, so those sliders run on a log scale. The number box beside each
 * label stays linear and authoritative; the slider is only the coarse control.
 */
const LOG_STEPS = 1000;

function toSlider(value: number, min: number, max: number, log: boolean) {
  if (!log) return value;
  return (LOG_STEPS * Math.log(value / min)) / Math.log(max / min);
}

function fromSlider(t: number, min: number, max: number, step: number, log: boolean) {
  if (!log) return t;
  const raw = min * (max / min) ** (t / LOG_STEPS);
  // Snap to a grain that suits the magnitude, not the linear step, so the log
  // slider still lands on round numbers whether it is reading 4.2 or 12 000.
  const grain = raw >= 1000 ? 100 : raw >= 100 ? 10 : raw >= 10 ? 1 : step;
  const snapped = Number((Math.round(raw / grain) * grain).toFixed(2));
  return Math.min(Math.max(snapped, min), max);
}

/**
 * Money formatters are built from the active locale rather than pinned to
 * en-US, so $4.72 becomes 4,72 $US in French. The grouping separator matters
 * more than it looks: a French reader who sees "1,250" reads one-point-two-five,
 * and this whole tool exists to stop people misreading a number.
 *
 * Which is why Arabic does not get to keep its own. ICU's ar-MA groups with a
 * FULL STOP and marks decimals with a comma, so this panel would show a 6.123
 * total sitting directly above a 6,88 unit cost — the two conventions inverted,
 * three lines apart, both plausible. The reader is holding a supplier quotation
 * written in Western figures; that is the document they have to reconcile
 * against, and "6.123" reads as six-point-one in it.
 *
 * Substituting a narrow no-break space for the group separator settles it. A
 * space cannot be mistaken for a decimal mark in any convention, so the comma is
 * left as the only radix point on screen and the ambiguity has nowhere to live.
 * It also lands Arabic on the same shape as French — space groups, comma
 * decimals — which is what Moroccan invoices and customs declarations already
 * use. Decimals are untouched; this is about the separator that has no
 * consistent meaning, not the one that does.
 */
function makeFormatters(locale: string) {
  const l = numericLocale(locale);

  // Ask the locale what it uses to group, rather than assuming: only a
  // full-stop grouper is dangerous, and only that one gets replaced.
  const groupSep = new Intl.NumberFormat(l).formatToParts(11111).find((p) => p.type === 'group')?.value;
  const degroup = (s: string) => (groupSep === '.' ? s.split('.').join(' ') : s);

  const usd = (n: number) =>
    degroup(n.toLocaleString(l, { style: 'currency', currency: 'USD', maximumFractionDigits: n < 100 ? 2 : 0 }));
  const mad = (n: number) => `${degroup(n.toLocaleString(l, { maximumFractionDigits: n < 100 ? 2 : 0 }))} MAD`;
  const plain = (n: number, digits = 0) => degroup(n.toLocaleString(l, { maximumFractionDigits: digits }));
  return { usd, mad, plain };
}

function Field({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  log = false,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  log?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-[13px] font-semibold text-deep">{label}</label>
        {/* Forced LTR even in Arabic. "$ 4.20 /kg" is a formula, not a sentence:
            the currency sign belongs before the figure and the unit after it, in
            that order, in every language this site speaks. */}
        <div className="flex items-center gap-1 font-mono text-xs text-sea" dir="ltr">
          {prefix && <span className="text-deep/45">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (!Number.isNaN(next)) onChange(Math.min(Math.max(next, min), max));
            }}
            aria-label={label}
            className="w-[76px] rounded-lg border border-sea/20 bg-shell px-2 py-1 text-right font-mono text-xs
                       text-abyss outline-none transition duration-300 focus:border-sea focus:bg-white
                       [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && <span className="text-deep/45">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={log ? 0 : min}
        max={log ? LOG_STEPS : max}
        step={log ? 1 : step}
        value={toSlider(value, min, max, log)}
        onChange={(event) => onChange(fromSlider(Number(event.target.value), min, max, step, log))}
        tabIndex={-1}
        aria-hidden="true"
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-foam
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                   [&::-webkit-slider-thumb]:bg-sea [&::-webkit-slider-thumb]:shadow-md
                   [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
                   [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-sea"
      />
      {hint && <p className="mt-2 text-[11px] leading-4 text-deep/50">{hint}</p>}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow flex items-center gap-3 text-sea">
        <span className="h-px w-5 bg-coral" />
        {title}
      </p>
      <div className="mt-5 space-y-6">{children}</div>
    </div>
  );
}

export function LandedCostCalculator() {
  const t = useT();
  const c = t.calculator;
  const { usd, mad, plain } = makeFormatters(t.meta.locale);

  const [mode, setMode] = useState<Mode>(DEFAULTS.mode);
  const [unitCost, setUnitCost] = useState(DEFAULTS.unitCost);
  const [quantity, setQuantity] = useState(DEFAULTS.quantity);
  const [unitWeight, setUnitWeight] = useState(DEFAULTS.unitWeight);
  const [freightRate, setFreightRate] = useState(DEFAULTS.freightRate);
  const [dutyRate, setDutyRate] = useState(DEFAULTS.dutyRate);
  const [vatRate, setVatRate] = useState(DEFAULTS.vatRate);
  const [clearance, setClearance] = useState(DEFAULTS.clearance);
  const [agencyFee, setAgencyFee] = useState(DEFAULTS.agencyFee);
  const [retailPrice, setRetailPrice] = useState(DEFAULTS.retailPrice);
  const [fx, setFx] = useState(DEFAULTS.fx);

  function pickMode(next: Mode) {
    setMode(next);
    setFreightRate(MODE_SPECS.find((m) => m.id === next)!.rate);
  }

  function reset() {
    setMode(DEFAULTS.mode);
    setUnitCost(DEFAULTS.unitCost);
    setQuantity(DEFAULTS.quantity);
    setUnitWeight(DEFAULTS.unitWeight);
    setFreightRate(DEFAULTS.freightRate);
    setDutyRate(DEFAULTS.dutyRate);
    setVatRate(DEFAULTS.vatRate);
    setClearance(DEFAULTS.clearance);
    setAgencyFee(DEFAULTS.agencyFee);
    setRetailPrice(DEFAULTS.retailPrice);
    setFx(DEFAULTS.fx);
  }

  /**
   * Morocco's order of assessment: duty is charged on the CIF value (goods +
   * freight), then VAT on top of the duty-inclusive value. Clearance sits
   * outside both — it is a service fee, not part of the dutiable base — and it
   * is flat per shipment, which is the whole reason per-unit cost falls as the
   * order grows. Our fee sits on the goods value only; we do not mark up your
   * freight or your taxes.
   */
  const r = useMemo(() => {
    const goods = unitCost * quantity;
    const weightKg = (unitWeight * quantity) / 1000;
    const freight = weightKg * freightRate;
    const duty = (goods + freight) * (dutyRate / 100);
    const vat = (goods + freight + duty) * (vatRate / 100);
    const fee = goods * (agencyFee / 100);
    const total = goods + freight + duty + vat + clearance + fee;
    const perUnit = quantity > 0 ? total / quantity : 0;
    const margin = retailPrice > 0 ? (retailPrice - perUnit) / retailPrice : 0;
    const markup = perUnit > 0 ? retailPrice / perUnit : 0;
    const profit = (retailPrice - perUnit) * quantity;
    return { goods, weightKg, freight, duty, vat, fee, total, perUnit, margin, markup, profit };
  }, [unitCost, quantity, unitWeight, freightRate, dutyRate, vatRate, clearance, agencyFee, retailPrice]);

  const bars = [
    { key: 'goods', label: c.bars.goods, value: r.goods, color: 'bg-wave' },
    { key: 'freight', label: c.bars.freight, value: r.freight, color: 'bg-sky' },
    { key: 'duty', label: c.bars.duty, value: r.duty, color: 'bg-sand' },
    { key: 'vat', label: c.bars.vat, value: r.vat, color: 'bg-coral' },
    // Neutral rather than another blue — mist sat too close to the sky used for
    // freight, and the two swatches read as the same colour in the legend.
    { key: 'clearance', label: c.bars.clearance, value: clearance, color: 'bg-white/75' },
    { key: 'fee', label: c.bars.fee, value: r.fee, color: 'bg-kelp' },
  ];

  // Judge the rounded figure we actually print, not the raw float — otherwise a
  // 44.986% margin renders as "45.0%" and gets labelled thin, and the caption
  // contradicts the number sitting directly above it.
  const shownMargin = Number((r.margin * 100).toFixed(1));

  const health =
    shownMargin >= 45
      ? { label: c.healthGood, color: 'text-kelp', bar: 'bg-kelp' }
      : shownMargin > 0
        ? { label: c.healthThin, color: 'text-sand', bar: 'bg-sand' }
        : { label: c.healthBad, color: 'text-coral', bar: 'bg-coral' };

  return (
    <div id="calculator" className="grid gap-5 lg:grid-cols-[1fr_.9fr] lg:items-start">
      {/* Inputs */}
      <div className="card border-sea/15 bg-white p-6 shadow-[0_30px_70px_-50px_rgba(4,38,59,.5)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-sea">{c.modeLabel}</p>
            <p className="mt-2 text-[13px] leading-5 text-deep/70">{c.modeBody}</p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-sea/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-deep/60 transition duration-300 hover:border-sea hover:text-sea"
            data-testid="button-calc-reset"
          >
            <RotateCcw size={12} /> {c.reset}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {MODE_SPECS.map((m, index) => {
            const active = mode === m.id;
            const copy = c.modes[index];
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => pickMode(m.id)}
                aria-pressed={active}
                className={`rounded-2xl border px-3 py-3 text-start transition duration-300 ${
                  active
                    ? 'border-sea bg-sea text-white shadow-[0_16px_30px_-18px_rgba(14,110,158,.9)]'
                    : 'border-sea/15 bg-shell text-deep/70 hover:border-sea/40 hover:bg-foam'
                }`}
                data-testid={`button-mode-${m.id}`}
              >
                <m.icon size={16} className={active ? 'text-sky' : 'text-sea'} />
                <span className="mt-2 block text-[13px] font-bold">{copy.label}</span>
                <span
                  className={`mt-0.5 block font-mono text-[9px] uppercase tracking-[0.1em] ${
                    active ? 'text-mist' : 'text-deep/45'
                  }`}
                >
                  {copy.transit}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-9 space-y-9">
          <Group title={c.groupOrder}>
            <Field label={c.unitCost} value={unitCost} onChange={setUnitCost} min={0.1} max={500} step={0.1} prefix="$" log />
            <Field label={c.quantity} value={quantity} onChange={setQuantity} min={10} max={50000} step={10} suffix={c.pcs} log />
            <Field
              label={c.unitWeight}
              hint={c.unitWeightHint}
              value={unitWeight}
              onChange={setUnitWeight}
              min={1}
              max={5000}
              step={1}
              suffix="g"
              log
            />
          </Group>

          <Group title={c.groupLanding}>
            <Field label={c.freightRate} value={freightRate} onChange={setFreightRate} min={0.2} max={25} step={0.1} prefix="$" suffix={c.perKg} log />
            <Field
              label={c.dutyRate}
              hint={c.dutyHint}
              value={dutyRate}
              onChange={setDutyRate}
              min={0}
              max={40}
              step={0.5}
              suffix="%"
            />
            <Field
              label={c.vatRate}
              hint={c.vatHint}
              value={vatRate}
              onChange={setVatRate}
              min={0}
              max={30}
              step={0.5}
              suffix="%"
            />
            <Field
              label={c.clearance}
              hint={c.clearanceHint}
              value={clearance}
              onChange={setClearance}
              min={0}
              max={3000}
              step={10}
              prefix="$"
            />
          </Group>

          <Group title={c.groupYours}>
            <Field
              label={c.agencyFee}
              hint={c.agencyFeeHint}
              value={agencyFee}
              onChange={setAgencyFee}
              min={0}
              max={20}
              step={0.5}
              suffix="%"
            />
            <Field label={c.retailPrice} value={retailPrice} onChange={setRetailPrice} min={0.5} max={2000} step={0.5} prefix="$" log />
          </Group>
        </div>
      </div>

      {/* Results */}
      <div className="lg:sticky lg:top-28">
        <div className="card overflow-hidden border-white/10 bg-abyss text-shell shadow-[0_40px_90px_-50px_rgba(4,38,59,.9)]">
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-7 sm:px-8">
            <div className="dot-grid absolute inset-0 opacity-20" />
            <div className="absolute -end-16 -top-16 h-48 w-48 rounded-full bg-sea/30 blur-3xl" />
            <div className="relative">
              <p className="eyebrow text-sky">{c.perUnitLabel}</p>
              <p className="display mt-3 text-[clamp(2.5rem,7vw,3.6rem)] text-shell" data-testid="text-calc-perunit">
                {usd(r.perUnit)}
              </p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-mist/70">
                {fill(c.perUnitNote, { mad: mad(r.perUnit * fx) })}
              </p>
              <p className="mt-5 border-t border-white/10 pt-4 font-mono text-[11px] leading-5 tracking-[0.06em] text-mist/60">
                {fill(c.orderTotal, { total: usd(r.total), kg: plain(r.weightKg) })}
              </p>
            </div>
          </div>

          <div className="px-6 pt-6 sm:px-8">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              {bars.map((bar) => (
                <motion.div
                  key={bar.key}
                  className={bar.color}
                  animate={{ width: `${r.total > 0 ? (bar.value / r.total) * 100 : 0}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              ))}
            </div>
            <dl className="mt-5 space-y-3">
              {bars.map((bar) => (
                <div key={bar.key} className="flex items-center justify-between gap-3 text-[13px]">
                  <dt className="flex items-center gap-2.5 text-mist/75">
                    <span className={`h-2 w-2 shrink-0 rounded-sm ${bar.color}`} />
                    {bar.label}
                  </dt>
                  <dd className="font-mono text-xs text-shell">{usd(bar.value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 border-t border-white/10 px-6 py-6 sm:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-sky">{c.margin}</p>
                <p className={`display mt-2 text-4xl ${health.color}`} data-testid="text-calc-margin">
                  {shownMargin.toFixed(1)}%
                </p>
              </div>
              <div className="text-end">
                <p className="eyebrow text-sky">{c.markup}</p>
                <p className="display mt-2 text-4xl text-shell">{r.markup.toFixed(2)}×</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={`h-full ${health.bar}`}
                animate={{ width: `${Math.max(0, Math.min(r.margin, 1)) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className={`mt-3 font-mono text-[10px] uppercase tracking-[0.16em] ${health.color}`}>{health.label}</p>
            {/* {profit} is deliberately left unfilled so the sentence can be
                split around it and the figure rendered bold. Every other
                placeholder is substituted first, which means the bold word lands
                wherever that language puts it — French and Arabic both order this
                sentence differently from English. */}
            <p className="mt-4 text-[13px] leading-6 text-mist/70">
              {(() => {
                const [before, after = ''] = fill(c.profitLine, {
                  qty: plain(quantity),
                  price: usd(retailPrice),
                  mad: mad(r.profit * fx),
                }).split('{profit}');
                return (
                  <>
                    {before}
                    <span className="font-bold text-shell">{usd(r.profit)}</span>
                    {after}
                  </>
                );
              })()}
            </p>
          </div>

          {/* Left-aligned on purpose: the floating WhatsApp launcher owns the
              bottom-right of the viewport, and this card's foot lands there. */}
          <div className="flex items-center gap-2 border-t border-white/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-mist/60 sm:px-8">
            <label htmlFor="fx-rate">{c.fxLabel}</label>
            <input
              id="fx-rate"
              type="number"
              value={fx}
              min={5}
              max={20}
              step={0.05}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (!Number.isNaN(next)) setFx(Math.min(Math.max(next, 5), 20));
              }}
              className="w-[64px] rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-right font-mono text-[11px]
                         text-shell outline-none transition duration-300 focus:border-sky
                         [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              dir="ltr"
            />
          </div>
        </div>

        <p className="mt-4 px-1 text-[11.5px] leading-5 text-deep/55">
          {c.disclaimerA}{' '}
          <Link
            to="/start"
            className="inline-flex items-center gap-1 font-semibold text-sea underline decoration-sea/30 underline-offset-2 transition duration-300 hover:decoration-sea"
            data-testid="link-calc-quote"
          >
            {c.disclaimerLink}
            <ArrowUpRight size={12} className="rtl:rotate-[-90deg]" />
          </Link>{' '}
          {c.disclaimerB}
        </p>
      </div>
    </div>
  );
}
