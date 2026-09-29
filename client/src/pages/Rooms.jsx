import { Check, Eye } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { AmenitiesStrip, CtaBanner, PageHero, RoomMeta } from '../components/sections.jsx';
import { Button, Container, Eyebrow, Img } from '../components/ui.jsx';
import { rooms } from '../data/hotel.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { formatPrice } from '../lib/format.js';
import { usePageTitle } from '../lib/usePageTitle.js';

// Secondary photo shown next to each room's main picture.
const detailPhoto = { executive: 'roomView', superieure: 'roomLounge', standard: 'roomSofa' };

function RoomSection({ room, index }) {
  const { t, lang } = useLanguage();
  const copy = t(`rooms.${room.id}`);
  const flipped = index % 2 === 1;

  return (
    <article id={room.id} className="scroll-mt-24 border-b border-line py-16 last:border-b-0 md:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={`grid grid-cols-[2fr_1fr] gap-3 ${flipped ? 'lg:order-2' : ''}`}>
          <Img name={room.id} alt={copy.name} sizes="(min-width: 1024px) 34vw, 66vw" className="aspect-[4/5] w-full" />
          <div className="grid gap-3">
            <Img name={detailPhoto[room.id]} alt="" sizes="(min-width: 1024px) 17vw, 33vw" className="size-full min-h-0" />
            <Img name="bathroom" alt="" sizes="(min-width: 1024px) 17vw, 33vw" className="size-full min-h-0" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <Eyebrow>{t('meta.rooms')}</Eyebrow>
          <h2 className="mt-4 font-display text-5xl font-medium md:text-6xl">{copy.name}</h2>
          <RoomMeta room={room} className="mt-5" />
          <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-ink/75">
            <Eye className="size-4 text-muted" strokeWidth={1.25} /> {t('common.cityView')}
          </p>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted">{copy.description}</p>

          <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6">
            <div>
              <p className="text-[11px] text-muted">{t('common.from')}</p>
              <p className="font-display text-4xl leading-tight">{formatPrice(room.price, lang)}</p>
              <p className="text-[11px] text-muted">{t('common.perNight')}</p>
            </div>
            <Button to={`/reservation?room=${room.id}`}>{t('common.bookRoom')}</Button>
          </div>
        </Reveal>
      </Container>
    </article>
  );
}

export default function Rooms() {
  const { t } = useLanguage();
  usePageTitle('rooms');

  return (
    <>
      <PageHero image="roomView" {...t('roomsPage.hero')} />
      {rooms.map((room, i) => (
        <RoomSection key={room.id} room={room} index={i} />
      ))}

      <section className="bg-forest text-white">
        <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <p className="eyebrow text-white/60">Hôtel de l’Air</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">{t('roomsPage.included')}</h2>
          </Reveal>
          <Reveal as="ul" delay={100} className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {t('roomsPage.equipment').map((item) => (
              <li key={item} className="flex items-center gap-3 border-b border-white/15 pb-4 text-[14.5px]">
                <Check className="size-4 shrink-0 text-brass" strokeWidth={1.75} />
                {item}
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      <AmenitiesStrip />
      <CtaBanner />
    </>
  );
}
