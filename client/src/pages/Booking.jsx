import { CalendarDays, Check, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import BookingBar from '../components/BookingBar.jsx';
import Field, { Honeypot } from '../components/Field.jsx';
import { RoomMeta } from '../components/sections.jsx';
import { Button, Container, Eyebrow, Img, Title } from '../components/ui.jsx';
import { hotel, maxRoomsPerBooking, roomById } from '../data/hotel.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { api } from '../lib/api.js';
import { formatDate, formatPrice } from '../lib/format.js';
import { usePageTitle } from '../lib/usePageTitle.js';

const STAY_FIELDS = ['checkIn', 'checkOut', 'guests', 'rooms', 'roomId'];
const emptyGuest = { name: '', email: '', phone: '', message: '', website: '' };

function clampInt(value, min, max, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

function RoomOption({ option, stay, selected, onSelect }) {
  const { t, lang } = useLanguage();
  const room = roomById(option.id);
  const copy = t(`rooms.${option.id}`);
  const lowStock = option.available && option.remaining <= 3;

  return (
    <li
      className={`grid gap-5 bg-white p-4 transition-shadow sm:grid-cols-[220px_1fr] md:p-5 ${
        selected ? 'ring-2 ring-forest' : 'ring-1 ring-line'
      } ${option.available ? '' : 'opacity-60'}`}
    >
      <Img name={option.id} alt="" sizes="(min-width: 640px) 220px, 100vw" className="aspect-[4/3] w-full sm:h-full" />
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h3 className="font-display text-3xl">{copy.name}</h3>
          <RoomMeta room={room} className="mt-3" />
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">{copy.short}</p>
          {lowStock && <p className="mt-3 text-[12.5px] font-medium text-brass">{t('bookingPage.left', option.remaining)}</p>}
          {!option.available && <p className="mt-3 text-[12.5px] font-medium text-red-700">{t('bookingPage.unavailable')}</p>}
        </div>
        <div className="shrink-0 md:text-right">
          <p className="text-[12px] text-muted">
            {formatPrice(option.price, lang)} {t('common.perNight')}
          </p>
          <p className="mt-1 font-display text-3xl leading-tight">{formatPrice(option.total, lang)}</p>
          <p className="text-[11.5px] text-muted">
            {t('bookingPage.totalFor', stay.nights)}
            {stay.rooms > 1 && ` · ${t('booking.rooms', stay.rooms)}`}
          </p>
          <button
            type="button"
            onClick={() => onSelect(option.id)}
            disabled={!option.available}
            aria-pressed={selected}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-[13px] tracking-wide transition-colors md:w-auto ${
              selected ? 'bg-forest text-white' : 'border border-forest text-forest hover:bg-forest hover:text-white'
            } disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-transparent`}
          >
            {selected && <Check className="size-4" strokeWidth={2} />}
            {selected ? t('bookingPage.selected') : t('bookingPage.select')}
          </button>
        </div>
      </div>
    </li>
  );
}

function Summary({ option, stay, promo }) {
  const { t, lang } = useLanguage();
  const long = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return (
    <aside className="bg-white ring-1 ring-line lg:sticky lg:top-24">
      <Img name={option.id} alt="" sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[16/9] w-full" />
      <div className="p-6">
        <Eyebrow>{t('bookingPage.summary')}</Eyebrow>
        <p className="mt-3 font-display text-3xl">{t(`rooms.${option.id}.name`)}</p>
        <dl className="mt-5 space-y-3 text-[13.5px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{t('booking.arrival')}</dt>
            <dd>{formatDate(stay.checkIn, lang, long)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{t('booking.departure')}</dt>
            <dd>{formatDate(stay.checkOut, lang, long)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{t('booking.travelers')}</dt>
            <dd>
              {t('booking.adults', stay.guests)} · {t('booking.rooms', stay.rooms)}
            </dd>
          </div>
          {promo && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{t('booking.promo')}</dt>
              <dd className="uppercase">{promo}</dd>
            </div>
          )}
        </dl>
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[12.5px] text-muted">
            {formatPrice(option.price, lang)} × {t('bookingPage.nights', stay.nights)}
            {stay.rooms > 1 && ` × ${t('booking.rooms', stay.rooms)}`}
          </p>
          <p className="mt-1 flex items-baseline justify-between gap-4 text-[13.5px]">
            <span className="text-muted">Total</span>
            <span className="font-display text-3xl">{formatPrice(option.total, lang)}</span>
          </p>
        </div>
        <p className="mt-5 bg-cream px-4 py-3 text-[12.5px] leading-relaxed text-muted">{t('bookingPage.payment')}</p>
      </div>
    </aside>
  );
}

function Confirmation({ result, name, onRestart }) {
  const { t, lang } = useLanguage();
  const long = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl bg-white p-8 text-center ring-1 ring-line md:p-14" role="status">
        <CheckCircle2 className="mx-auto size-12 text-forest" strokeWidth={1} />
        <Eyebrow className="mt-6">{t('bookingPage.done.eyebrow')}</Eyebrow>
        <Title as="h1" lines={t('bookingPage.done.title', name.split(' ')[0])} className="mt-4 text-5xl" />
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">{t('bookingPage.done.text')}</p>

        <div className="mt-8 border border-dashed border-brass/60 bg-cream px-6 py-5">
          <p className="eyebrow text-[10px] text-muted">{t('bookingPage.done.reference')}</p>
          <p className="mt-2 font-display text-4xl tracking-wider text-forest">{result.reference}</p>
        </div>

        <dl className="mt-8 grid gap-4 text-left text-[14px] sm:grid-cols-2">
          <div>
            <dt className="text-[12px] text-muted">{t('meta.rooms')}</dt>
            <dd>
              {t(`rooms.${result.roomId}.name`)} · {t('booking.rooms', result.rooms)}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-muted">{t('booking.travelers')}</dt>
            <dd>{t('booking.adults', result.guests)}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-muted">{t('booking.arrival')}</dt>
            <dd>{formatDate(result.checkIn, lang, long)}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-muted">{t('booking.departure')}</dt>
            <dd>{formatDate(result.checkOut, lang, long)}</dd>
          </div>
          <div className="border-t border-line pt-4 sm:col-span-2">
            <dt className="text-[12px] text-muted">{t('bookingPage.totalFor', result.nights)}</dt>
            <dd className="font-display text-3xl">{formatPrice(result.total, lang)}</dd>
          </div>
        </dl>

        <p className="mt-6 text-[13px] text-muted">
          {hotel.phone} · {hotel.email}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button to="/" variant="outline" arrow={false}>
            {t('bookingPage.done.home')}
          </Button>
          <Button onClick={onRestart}>{t('bookingPage.done.again')}</Button>
        </div>
      </div>
    </Container>
  );
}

export default function Booking() {
  const { t, lang } = useLanguage();
  usePageTitle('booking');
  const [params, setParams] = useSearchParams();

  const stay = {
    checkIn: params.get('checkIn') ?? '',
    checkOut: params.get('checkOut') ?? '',
    guests: clampInt(params.get('guests'), 1, maxRoomsPerBooking * 2, 2),
    rooms: clampInt(params.get('rooms'), 1, maxRoomsPerBooking, 1),
  };
  const promo = params.get('promo') ?? '';
  const preferredRoom = params.get('room') ?? '';
  const hasDates = Boolean(stay.checkIn && stay.checkOut);

  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState('');
  const [guest, setGuest] = useState(emptyGuest);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (!hasDates) {
      setAvailability(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setSearchError(null);
    api
      .availability({ checkIn: stay.checkIn, checkOut: stay.checkOut, guests: stay.guests, rooms: stay.rooms }, controller.signal)
      .then((data) => {
        setAvailability(data);
        setSelected((current) => {
          const wanted = current || preferredRoom;
          return data.rooms.some((r) => r.id === wanted && r.available) ? wanted : '';
        });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setAvailability(null);
        setSearchError(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stay.checkIn, stay.checkOut, stay.guests, stay.rooms, refresh]);

  function search(query) {
    const next = new URLSearchParams({ checkIn: query.checkIn, checkOut: query.checkOut, guests: query.guests, rooms: query.rooms });
    if (query.promo) next.set('promo', query.promo);
    if (preferredRoom) next.set('room', preferredRoom);
    setSubmitError(null);
    setParams(next);
  }

  function select(id) {
    setSelected(id);
    setSubmitError(null);
    requestAnimationFrame(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setSubmitError(null);
    try {
      const result = await api.reserve({ ...stay, ...guest, roomId: selected, promoCode: promo, lang });
      setConfirmation({ result, name: guest.name.trim() });
      setGuest(emptyGuest);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setSubmitError(err);
      if (err.code === 'unavailable') setRefresh((n) => n + 1);
    } finally {
      setSending(false);
    }
  }

  function restart() {
    setConfirmation(null);
    setSelected('');
    setParams(new URLSearchParams());
    window.scrollTo({ top: 0 });
  }

  if (confirmation) return <Confirmation {...confirmation} onRestart={restart} />;

  const option = availability?.rooms.find((r) => r.id === selected);
  const fieldError = (key) => submitError?.fields?.[key];
  const stayFieldError = submitError?.fields && STAY_FIELDS.map((k) => submitError.fields[k]).find(Boolean);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-forest-dark pb-28 pt-16 text-white md:pt-20">
        <Img name="executive" eager alt="" className="absolute inset-0 -z-10 size-full opacity-35" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-forest-dark via-forest-dark/60 to-transparent" />
        <Container>
          <p className="eyebrow text-white/70">{t('bookingPage.hero.eyebrow')}</p>
          <Title as="h1" lines={t('bookingPage.hero.title')} className="mt-4 text-5xl md:text-6xl" />
          <p className="mt-4 max-w-lg text-white/80">{t('bookingPage.hero.text')}</p>
        </Container>
      </section>

      <Container className="relative z-10 -mt-16">
        <BookingBar key={params.toString()} initial={{ ...stay, promo }} onSearch={search} />
      </Container>

      <Container as="section" className="py-14 md:py-20" aria-live="polite">
        {loading && (
          <p className="flex items-center gap-3 text-muted">
            <Loader2 className="size-5 animate-spin" strokeWidth={1.5} /> {t('bookingPage.searching')}
          </p>
        )}

        {searchError && !loading && (
          <p role="alert" className="bg-white p-5 text-sm text-red-700 ring-1 ring-red-200">
            {searchError.fields
              ? Object.values(searchError.fields)
                  .map((code) => t(`errors.${code}`))
                  .join(' ')
              : t(`errors.${searchError.code}`)}
          </p>
        )}

        {!hasDates && !loading && (
          <div className="flex items-center gap-4 text-muted">
            <CalendarDays className="size-6 shrink-0 text-forest" strokeWidth={1} />
            <p>{t('booking.missingDates')}</p>
          </div>
        )}

        {availability && !loading && (
          <>
            <h2 className="font-display text-3xl md:text-4xl">{t('bookingPage.resultsTitle', availability.nights)}</h2>
            {submitError?.code === 'unavailable' && (
              <p role="alert" className="mt-6 bg-white p-5 text-sm text-red-700 ring-1 ring-red-200">
                {t('errors.unavailable')}
              </p>
            )}
            <ul className="mt-8 space-y-5">
              {availability.rooms.map((opt) => (
                <RoomOption key={opt.id} option={opt} stay={availability} selected={opt.id === selected} onSelect={select} />
              ))}
            </ul>
          </>
        )}

        {option && availability && !loading && (
          <div ref={detailsRef} className="mt-16 grid scroll-mt-24 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <form onSubmit={submit} noValidate className="relative bg-white p-7 ring-1 ring-line md:p-10">
              <h2 className="font-display text-3xl md:text-4xl">{t('bookingPage.detailsTitle')}</h2>
              <div className="mt-8 grid gap-7 sm:grid-cols-2">
                <Field
                  label={t('bookingPage.form.name')}
                  value={guest.name}
                  onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                  error={fieldError('name')}
                  autoComplete="name"
                  required
                  className="sm:col-span-2"
                />
                <Field
                  label={t('bookingPage.form.email')}
                  type="email"
                  value={guest.email}
                  onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                  error={fieldError('email')}
                  autoComplete="email"
                  required
                />
                <Field
                  label={t('bookingPage.form.phone')}
                  type="tel"
                  value={guest.phone}
                  onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                  error={fieldError('phone')}
                  autoComplete="tel"
                  placeholder="+237 6 …"
                  required
                />
                <Field
                  label={t('bookingPage.form.message')}
                  multiline
                  value={guest.message}
                  onChange={(e) => setGuest({ ...guest, message: e.target.value })}
                  error={fieldError('message')}
                  placeholder={t('bookingPage.form.messagePlaceholder')}
                  className="sm:col-span-2"
                />
              </div>
              <Honeypot value={guest.website} onChange={(website) => setGuest({ ...guest, website })} />
              {submitError && (
                <p role="alert" className="mt-6 text-sm text-red-700">
                  {stayFieldError ? t(`errors.${stayFieldError}`) : t(`errors.${submitError.code}`)}
                </p>
              )}
              <Button type="submit" className="mt-9 w-full sm:w-auto" disabled={sending}>
                {sending ? t('bookingPage.form.sending') : t('bookingPage.form.submit')}
              </Button>
            </form>
            <Summary option={option} stay={availability} promo={promo} />
          </div>
        )}
      </Container>
    </>
  );
}
