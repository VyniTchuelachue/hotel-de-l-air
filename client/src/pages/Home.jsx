import { ArrowRight, BellRing, MapPin, Star, UtensilsCrossed, Wifi } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import BookingBar from '../components/BookingBar.jsx';
import Reveal from '../components/Reveal.jsx';
import { AmenitiesStrip, CtaBanner, MapEmbed, RoomCard, SectionIntro } from '../components/sections.jsx';
import { AsideLabel, Button, Container, Img, TextLink, Title } from '../components/ui.jsx';
import { hotel, rooms } from '../data/hotel.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';

function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative isolate overflow-hidden bg-forest-dark">
      <Img name="hero" eager alt="" className="absolute inset-0 -z-10 size-full animate-kenburns" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/40 to-black/0" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-black/40 to-transparent" />

      <Container className="flex min-h-[600px] flex-col justify-center pb-32 pt-16 text-white md:min-h-[660px] lg:min-h-[700px]">
        <p className="eyebrow animate-fade-up text-white/80">{t('hero.eyebrow')}</p>
        <Title
          as="h1"
          lines={t('hero.title')}
          className="mt-5 animate-fade-up text-[3.4rem] [animation-delay:120ms] sm:text-7xl lg:text-[5.5rem]"
        />
        <p className="mt-6 max-w-xl animate-fade-up font-display text-2xl leading-snug [animation-delay:240ms] md:text-[28px]">
          {t('hero.subtitle')}
        </p>
        <p className="mt-3 max-w-md animate-fade-up text-[15px] leading-relaxed text-white/80 [animation-delay:320ms]">
          {t('hero.text')}
        </p>
        <div className="mt-9 flex animate-fade-up flex-wrap gap-4 [animation-delay:420ms]">
          <Button href="#reserver" className="!bg-forest/95 ring-1 ring-white/10">
            {t('hero.primary')}
          </Button>
          <Button to="/hotel" variant="light" arrow={false}>
            {t('hero.secondary')}
          </Button>
        </div>
      </Container>

      <AsideLabel words={t('hero.aside')} className="absolute right-8 top-10 hidden text-right md:block [&>span:last-child]:ml-auto" />
    </section>
  );
}

function Intro() {
  const { t } = useLanguage();
  const icons = [MapPin, Wifi, UtensilsCrossed, BellRing];
  return (
    <Container as="section" className="grid gap-10 py-20 md:py-24 lg:grid-cols-[1.1fr_1fr_1.15fr] lg:gap-14">
      <Reveal>
        <SectionIntro eyebrow={t('intro.eyebrow')} title={t('intro.title')} titleClass="text-4xl md:text-[3.2rem]" />
      </Reveal>
      <Reveal delay={100} className="lg:pt-9">
        <p className="text-[15px] leading-relaxed text-muted">{t('intro.text')}</p>
        <TextLink to="/hotel" className="mt-6">
          {t('intro.link')}
        </TextLink>
      </Reveal>
      <Reveal delay={200} as="ul" className="grid grid-cols-2 gap-x-6 gap-y-8 border-line lg:border-l lg:pl-12 lg:pt-9">
        {t('intro.features').map((f, i) => {
          const Icon = icons[i];
          return (
            <li key={f.title} className="flex gap-3">
              <Icon className="mt-0.5 size-6 shrink-0 text-ink/80" strokeWidth={1} />
              <div>
                <p className="text-[13.5px]">{f.title}</p>
                <p className="text-[12px] text-muted">{f.text}</p>
              </div>
            </li>
          );
        })}
      </Reveal>
    </Container>
  );
}

function RoomsPreview() {
  const { t } = useLanguage();
  return (
    <section className="pb-20 md:pb-24">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionIntro eyebrow={t('roomsSection.eyebrow')} title={t('roomsSection.title')} />
          <TextLink to="/chambres">{t('roomsSection.all')}</TextLink>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {rooms.map((room, i) => (
            <Reveal key={room.id} delay={i * 120}>
              <RoomCard room={room} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function RestaurantTeaser() {
  const { t } = useLanguage();
  return (
    <section className="grid gap-1 bg-cream lg:grid-cols-[1.85fr_1fr]">
      <div className="relative isolate flex min-h-[460px] items-center overflow-hidden">
        <Img name="restaurant" alt="" sizes="(min-width: 1024px) 65vw, 100vw" className="absolute inset-0 -z-10 size-full" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/45 to-black/5" />
        <Reveal className="px-6 py-16 text-white sm:px-12 lg:px-16">
          <p className="eyebrow text-white/75">{t('restaurantSection.eyebrow')}</p>
          <Title lines={t('restaurantSection.title')} className="mt-4 text-4xl md:text-[3.4rem]" />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/85">{t('restaurantSection.text')}</p>
          <Button to="/restaurant" className="mt-8">
            {t('restaurantSection.cta')}
          </Button>
        </Reveal>
      </div>
      <div className="relative min-h-[340px] overflow-hidden">
        <Img name="dish" alt="" sizes="(min-width: 1024px) 35vw, 100vw" className="absolute inset-0 size-full" />
        <div className="absolute inset-0 bg-linear-to-bl from-black/45 via-transparent to-transparent" />
        <AsideLabel words={t('restaurantSection.aside')} className="absolute right-7 top-8 text-right [&>span:last-child]:ml-auto" />
      </div>
    </section>
  );
}

function ExperiencesPreview() {
  const { t } = useLanguage();
  const pics = ['breakfast', 'douala', 'garden'];
  return (
    <Container as="section" className="grid gap-10 py-20 md:py-24 lg:grid-cols-[1.2fr_3fr] lg:items-center">
      <Reveal>
        <SectionIntro
          eyebrow={t('experiencesSection.eyebrow')}
          title={t('experiencesSection.title')}
          titleClass="text-4xl xl:text-[2.9rem]"
        />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-3">
        {t('experiencesSection.items').map((item, i) => (
          <Reveal key={item.title} delay={i * 120}>
            <Link to="/experiences" className="group block bg-white">
              <div className="overflow-hidden">
                <Img
                  name={pics[i]}
                  alt=""
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 100vw"
                  className="aspect-[4/3] w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <h3 className="font-display text-[22px] leading-tight">{item.title}</h3>
                  <p className="mt-1 text-[12.5px] text-muted">{item.text}</p>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-forest group-hover:bg-forest group-hover:text-white">
                  <ArrowRight className="size-3.5" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}

function Stars({ className = '' }) {
  return (
    <div className={`flex gap-0.5 text-brass ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-3.5 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

function Reviews() {
  const { t, lang } = useLanguage();
  const { booking, hotelsCom } = hotel.ratings;
  const score = (n) => (lang === 'fr' ? String(n).replace('.', ',') : String(n));
  const card = 'flex h-full min-w-[78%] snap-start flex-col bg-white p-7 sm:min-w-0';

  return (
    <section className="border-t border-line bg-sand/50">
      <Container className="grid gap-10 py-20 md:py-24 lg:grid-cols-[1.2fr_3fr] lg:items-center">
        <Reveal>
          <SectionIntro eyebrow={t('reviews.eyebrow')} title={t('reviews.title')} titleClass="text-4xl xl:text-[2.9rem]" />
        </Reveal>
        <Reveal delay={100} className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          <article className={card}>
            <Stars />
            <p className="mt-5 font-display text-5xl leading-none">
              {score(booking.score)}
              <span className="text-2xl text-muted">/10</span>
            </p>
            <p className="eyebrow mt-3 text-[10px] text-forest">{t('reviews.bookingLabel')}</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{t('reviews.bookingText')}</p>
            <p className="mt-auto pt-5 text-[12px] text-muted">
              {score(hotelsCom.score)}/10 {t('reviews.hotelsCom')}
            </p>
          </article>
          <article className={card}>
            <Stars />
            <p className="mt-5 font-display text-5xl leading-none">
              {score(booking.staff)}
              <span className="text-2xl text-muted">/10</span>
            </p>
            <p className="eyebrow mt-3 text-[10px] text-forest">{t('reviews.staffLabel')}</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{t('reviews.staffText')}</p>
          </article>
          <figure className={card}>
            <Stars />
            <blockquote className="mt-5 font-display text-[21px] leading-snug">“{t('reviews.quote')}”</blockquote>
            <figcaption className="mt-auto flex items-center gap-3 pt-6">
              <span className="grid size-10 place-items-center rounded-full bg-forest font-display text-lg text-white">
                {t('reviews.quoteAuthor')[0]}
              </span>
              <span>
                <span className="block text-[13.5px]">{t('reviews.quoteAuthor')}</span>
                <span className="block text-[11.5px] text-muted">{t('reviews.quoteMeta')}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}

function Location() {
  const { t } = useLanguage();
  return (
    <section className="border-t border-line">
      <Container className="grid gap-10 py-20 md:py-24 lg:grid-cols-[1fr_1.35fr_0.9fr] lg:items-center lg:gap-12">
        <Reveal>
          <SectionIntro eyebrow={t('location.eyebrow')} title={t('location.title')} />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted">{t('location.text')}</p>
          <p className="mt-4 flex items-start gap-2 text-[13.5px]">
            <MapPin className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={1.5} />
            {hotel.street}, {hotel.district}, {hotel.city}
          </p>
          <Button href={hotel.directionsUrl} target="_blank" rel="noreferrer" className="mt-8">
            {t('common.directions')}
          </Button>
        </Reveal>
        <Reveal delay={100}>
          <MapEmbed className="h-[340px] md:h-[380px]" />
        </Reveal>
        <Reveal delay={200}>
          <p className="eyebrow text-muted">{t('location.nearbyTitle')}</p>
          <ul className="mt-5 divide-y divide-line">
            {t('location.nearby').map((place) => (
              <li key={place.label} className="flex items-baseline justify-between gap-4 py-3 text-[13.5px]">
                <span>{place.label}</span>
                <span className="whitespace-nowrap text-muted">{place.value}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  usePageTitle('home');

  function search(query) {
    const params = new URLSearchParams({ ...query, guests: String(query.guests), rooms: String(query.rooms) });
    if (!query.promo) params.delete('promo');
    navigate(`/reservation?${params}`);
  }

  return (
    <>
      <Hero />
      <div id="reserver" className="relative z-10 -mt-20 scroll-mt-28">
        <Container>
          <BookingBar showFrom onSearch={search} className="animate-fade-up [animation-delay:500ms]" />
        </Container>
      </div>
      <Intro />
      <RoomsPreview />
      <AmenitiesStrip />
      <RestaurantTeaser />
      <ExperiencesPreview />
      <Reviews />
      <Location />
      <CtaBanner />
    </>
  );
}
