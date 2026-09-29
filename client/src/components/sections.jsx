import { BedDouble, Car, Coffee, Maximize, Plane, Snowflake, Users, Waves, Wifi } from 'lucide-react';
import { Link } from 'react-router';
import { hotel } from '../data/hotel.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { formatPrice } from '../lib/format.js';
import Reveal from './Reveal.jsx';
import { Button, Container, Eyebrow, Img, TextLink, Title } from './ui.jsx';

/** Size · capacity · bed icons row, shared by room cards and the rooms page. */
export function RoomMeta({ room, className = '' }) {
  const { t } = useLanguage();
  const item = 'flex items-center gap-1.5';
  const icon = 'size-4 text-muted';
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink/75 ${className}`}>
      <li className={item}>
        <Maximize className={icon} strokeWidth={1.25} />
        {room.size} {t('common.sqm')}
      </li>
      <li className={item}>
        <Users className={icon} strokeWidth={1.25} />
        {t('booking.adults', room.capacity)}
      </li>
      <li className={item}>
        <BedDouble className={icon} strokeWidth={1.25} />
        {t(`common.bed.${room.bed}`)}
      </li>
    </ul>
  );
}

export function RoomCard({ room }) {
  const { t, lang } = useLanguage();
  const copy = t(`rooms.${room.id}`);
  return (
    <article className="group flex h-full flex-col bg-white">
      <Link to={`/chambres#${room.id}`} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <Img
          name={room.id}
          alt=""
          sizes="(min-width: 768px) 33vw, 100vw"
          className="aspect-[4/3] w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[28px] leading-none">
          <Link to={`/chambres#${room.id}`} className="hover:text-forest">
            {copy.name}
          </Link>
        </h3>
        <RoomMeta room={room} className="mt-4" />
        <div className="mt-5 flex flex-1 items-end justify-between gap-6">
          <p className="max-w-[26ch] text-[13.5px] leading-relaxed text-muted">{copy.short}</p>
          <div className="shrink-0 text-right">
            <p className="text-[11px] text-muted">{t('common.from')}</p>
            <p className="font-display text-[22px] leading-tight whitespace-nowrap">{formatPrice(room.price, lang)}</p>
            <p className="text-[11px] text-muted">{t('common.perNight')}</p>
          </div>
        </div>
        <TextLink to={`/chambres#${room.id}`} className="mt-5 self-start">
          {t('common.discover')}
        </TextLink>
      </div>
    </article>
  );
}

const amenityIcons = [Snowflake, Coffee, Waves, Car, Plane, Wifi];

export function AmenitiesStrip() {
  const { t } = useLanguage();
  return (
    <section className="border-y border-line bg-white/60" aria-label="Services">
      <Container as="ul" className="grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0">
        {t('amenities').map((a, i) => {
          const Icon = amenityIcons[i];
          return (
            <li key={a.title} className="flex items-center gap-3.5 lg:justify-center lg:border-l lg:border-line lg:first:border-l-0">
              <Icon className="size-7 shrink-0 text-ink/80" strokeWidth={1} />
              <div>
                <p className="text-[13.5px]">{a.title}</p>
                <p className="text-[11.5px] text-muted">{a.text}</p>
              </div>
            </li>
          );
        })}
      </Container>
    </section>
  );
}

/** Full-width photo header for inner pages. */
export function PageHero({ image, eyebrow, title, text }) {
  return (
    <section className="relative isolate flex min-h-[380px] items-end overflow-hidden bg-forest-dark md:min-h-[460px]">
      <Img name={image} eager alt="" className="absolute inset-0 -z-10 size-full animate-kenburns" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
      <Container className="pb-14 pt-28 text-white md:pb-16">
        <p className="eyebrow animate-fade-up text-white/80">{eyebrow}</p>
        <Title as="h1" lines={title} className="mt-4 animate-fade-up text-5xl [animation-delay:120ms] md:text-7xl" />
        {text && <p className="mt-4 max-w-lg animate-fade-up text-lg text-white/85 [animation-delay:240ms]">{text}</p>}
      </Container>
    </section>
  );
}

/** Dark green closing banner inviting to book. */
export function CtaBanner({ image = 'lounge' }) {
  const { t } = useLanguage();
  return (
    <section className="relative isolate overflow-hidden bg-forest-dark">
      <Img name={image} alt="" className="absolute inset-0 -z-10 size-full" />
      <div className="absolute inset-0 -z-10 bg-forest-dark/75" />
      <Reveal as={Container} className="py-20 text-center text-white md:py-24">
        <p className="eyebrow text-white/70">{t('cta.eyebrow')}</p>
        <Title lines={t('cta.title')} className="mx-auto mt-4 max-w-4xl text-balance text-4xl md:text-6xl" />
        <p className="mt-4 text-white/80">{t('cta.text')}</p>
        <Button to="/reservation" variant="white" className="mt-8">
          {t('cta.button')}
        </Button>
      </Reveal>
    </section>
  );
}

export function MapEmbed({ className = '' }) {
  const { t } = useLanguage();
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      <iframe
        title={t('common.mapTitle')}
        src={hotel.mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0 [filter:grayscale(0.55)_sepia(0.18)_contrast(0.95)]"
        allowFullScreen
      />
      {/* Custom pin; its tip sits on the map centre, i.e. the hotel. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[53px] flex-col items-center">
        <span className="grid size-11 place-items-center rounded-full rounded-br-none bg-forest font-display text-xl text-white shadow-lg ring-4 ring-white/80 [transform:rotate(45deg)]">
          <span className="[transform:rotate(-45deg)]">H</span>
        </span>
        <span className="mt-3 bg-white px-3 py-1.5 text-center shadow-md">
          <span className="block font-display text-[15px] leading-tight">{hotel.name}</span>
          <span className="block text-[9px] tracking-[0.2em] text-muted">DOUALA · BONAPRISO</span>
        </span>
      </div>
    </div>
  );
}

/** Eyebrow + title block used at the top of most sections. */
export function SectionIntro({ eyebrow, title, className = '', titleClass = 'text-4xl md:text-5xl' }) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Title lines={title} className={`mt-4 ${titleClass}`} />
    </div>
  );
}
