import { ArrowRight, CalendarDays, ChevronDown, Minus, Plus, TicketPercent, Users } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { lowestPrice, maxRoomsPerBooking } from '../data/hotel.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { addDays, formatDate, formatPrice, todayIso } from '../lib/format.js';

const CAPACITY = 2;
const fieldBase = 'relative flex items-center gap-3 px-5 py-4 lg:py-5';
const iconClass = 'size-5 shrink-0 text-ink/70';

function DateField({ label, value, min, onChange }) {
  const { t, lang } = useLanguage();
  const id = useId();
  return (
    <div className={`${fieldBase} group cursor-pointer`}>
      <CalendarDays className={iconClass} strokeWidth={1.25} />
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-[12.5px] text-ink">
          {label}
        </label>
        <span className={`block truncate text-[12.5px] ${value ? 'text-ink' : 'text-muted'}`}>
          {value ? formatDate(value, lang) : t('booking.chooseDate')}
        </span>
      </div>
      <ChevronDown className="size-4 text-muted transition-transform group-hover:translate-y-0.5" strokeWidth={1.5} />
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        required
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker();
          } catch {
            // Older browsers open their own picker on focus.
          }
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

function Stepper({ label, value, min, max, onChange }) {
  const { t } = useLanguage();
  const btn =
    'grid size-8 place-items-center rounded-full border border-line text-ink transition-colors hover:border-forest hover:text-forest disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink';
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`${t('booking.decrease')} — ${label}`}>
          <Minus className="size-3.5" />
        </button>
        <span className="w-4 text-center text-sm tabular-nums" aria-live="polite">
          {value}
        </span>
        <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`${t('booking.increase')} — ${label}`}>
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function GuestsField({ guests, rooms, onChange }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`${fieldBase} group w-full text-left`}
      >
        <Users className={iconClass} strokeWidth={1.25} />
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] text-ink">{t('booking.travelers')}</span>
          <span className="block truncate text-[12.5px] text-muted">
            {t('booking.adults', guests)}
            {rooms > 1 && ` · ${t('booking.rooms', rooms)}`}
          </span>
        </span>
        <ChevronDown className={`size-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.5} />
      </button>
      {open && (
        <div id={panelId} className="absolute left-0 right-0 top-full z-30 mt-2 min-w-64 bg-white p-5 shadow-xl ring-1 ring-line lg:left-auto">
          <Stepper
            label={t('booking.adultsLabel')}
            value={guests}
            min={1}
            max={rooms * CAPACITY}
            onChange={(g) => onChange({ guests: g, rooms })}
          />
          <Stepper
            label={t('booking.roomsLabel')}
            value={rooms}
            min={1}
            max={maxRoomsPerBooking}
            onChange={(r) => onChange({ rooms: r, guests: Math.min(guests, r * CAPACITY) })}
          />
          <button type="button" onClick={() => setOpen(false)} className="mt-3 w-full bg-forest py-2.5 text-[13px] text-white hover:bg-forest-dark">
            {t('booking.done')}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Dates / guests / promo search bar. Calls `onSearch({ checkIn, checkOut, guests, rooms, promo })`.
 */
export default function BookingBar({ initial = {}, onSearch, showFrom = false, className = '' }) {
  const { t, lang } = useLanguage();
  const today = todayIso();
  const [checkIn, setCheckIn] = useState(initial.checkIn ?? '');
  const [checkOut, setCheckOut] = useState(initial.checkOut ?? '');
  const [party, setParty] = useState({ guests: initial.guests ?? 2, rooms: initial.rooms ?? 1 });
  const [promo, setPromo] = useState(initial.promo ?? '');
  const [error, setError] = useState('');

  function changeCheckIn(value) {
    setCheckIn(value);
    setError('');
    if (value && (!checkOut || checkOut <= value)) setCheckOut(addDays(value, 1));
  }

  function submit(e) {
    e.preventDefault();
    if (!checkIn || !checkOut) return setError(t('booking.missingDates'));
    if (checkOut <= checkIn) return setError(t('errors.order'));
    onSearch({ checkIn, checkOut, ...party, promo: promo.trim() });
  }

  const divider = 'border-line max-lg:border-b lg:border-r';

  return (
    <form onSubmit={submit} className={`bg-white shadow-[0_20px_50px_-24px_rgba(20,38,25,0.35)] ${className}`} noValidate>
      <div className={`grid grid-cols-2 lg:items-center ${showFrom ? 'lg:grid-cols-[1fr_1fr_1.05fr_1.15fr_auto_auto]' : 'lg:grid-cols-[1fr_1fr_1.05fr_1.15fr_auto]'}`}>
        <div className={`${divider} max-lg:border-r`}>
          <DateField label={t('booking.arrival')} value={checkIn} min={today} onChange={changeCheckIn} />
        </div>
        <div className={divider}>
          <DateField
            label={t('booking.departure')}
            value={checkOut}
            min={checkIn ? addDays(checkIn, 1) : addDays(today, 1)}
            onChange={(v) => {
              setCheckOut(v);
              setError('');
            }}
          />
        </div>
        <div className={`${divider} max-lg:col-span-2`}>
          <GuestsField guests={party.guests} rooms={party.rooms} onChange={setParty} />
        </div>
        <label className={`${fieldBase} ${divider} max-lg:col-span-2 cursor-text`}>
          <TicketPercent className={iconClass} strokeWidth={1.25} />
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] text-ink">{t('booking.promo')}</span>
            <input
              type="text"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder={t('booking.promoPlaceholder')}
              maxLength={30}
              className="block w-full bg-transparent text-[12.5px] text-ink placeholder:text-muted focus:outline-none"
            />
          </span>
        </label>
        <div className="p-3 max-lg:col-span-2 lg:px-4">
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-3 bg-forest px-6 py-4 text-[13px] tracking-wide text-white transition-colors hover:bg-forest-dark lg:whitespace-nowrap"
          >
            {t('booking.submit')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </button>
        </div>
        {showFrom && (
          <div className="hidden pr-6 pl-2 xl:block">
            <p className="text-[11px] text-muted">{t('booking.from')}</p>
            <p className="font-display text-2xl leading-tight whitespace-nowrap">{formatPrice(lowestPrice, lang)}</p>
            <p className="text-[11px] text-muted">{t('common.perNight')}</p>
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="border-t border-line px-5 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
