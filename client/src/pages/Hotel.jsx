import {
  Accessibility,
  BellRing,
  Car,
  CigaretteOff,
  ConciergeBell,
  Dumbbell,
  Plane,
  Snowflake,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wine,
} from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { CtaBanner, PageHero, SectionIntro } from '../components/sections.jsx';
import { Container, Img } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';

const serviceIcons = [Wifi, Snowflake, Waves, Dumbbell, UtensilsCrossed, Wine, ConciergeBell, Plane, Car, Accessibility, CigaretteOff, BellRing];
const gallery = ['lobby', 'executive', 'pool', 'restaurant', 'lounge'];

export default function Hotel() {
  const { t } = useLanguage();
  usePageTitle('hotel');

  return (
    <>
      <PageHero image="lobby" {...t('hotelPage.hero')} />

      <Container as="section" className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionIntro eyebrow={t('hotelPage.story.eyebrow')} title={t('hotelPage.story.title')} />
          {t('hotelPage.story.paragraphs').map((p) => (
            <p key={p} className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </Reveal>
        <Reveal delay={120} className="relative">
          <Img name="lounge" alt="" sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[5/4] w-full" />
          <div className="absolute -bottom-8 -left-4 hidden w-48 border-8 border-cream sm:block lg:-left-10">
            <Img name="hero" alt="" sizes="192px" className="aspect-square w-full" />
          </div>
        </Reveal>
      </Container>

      <section className="border-y border-line bg-white/60">
        <Container as="dl" className="grid grid-cols-2 gap-y-10 py-12 lg:grid-cols-4">
          {t('hotelPage.stats').map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="flex flex-col-reverse text-center lg:border-l lg:border-line lg:first:border-l-0">
              <dt className="mt-2 text-[12.5px] text-muted">{s.label}</dt>
              <dd className="font-display text-5xl text-forest">{s.value}</dd>
            </Reveal>
          ))}
        </Container>
      </section>

      <Container as="section" className="py-20 md:py-28">
        <Reveal>
          <SectionIntro eyebrow={t('hotelPage.services.eyebrow')} title={t('hotelPage.services.title')} />
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
          {t('hotelPage.services.items').map((label, i) => {
            const Icon = serviceIcons[i];
            return (
              <li key={label} className="flex items-center gap-4 bg-cream p-5 md:p-7">
                <Icon className="size-6 shrink-0 text-forest" strokeWidth={1} />
                <span className="text-[14px]">{label}</span>
              </li>
            );
          })}
        </ul>
      </Container>

      <section className="bg-forest text-white">
        <Container className="grid gap-12 py-20 md:py-24 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="eyebrow text-white/60">{t('hotelPage.practical.eyebrow')}</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">{t('hotelPage.practical.title')}</h2>
          </Reveal>
          <Reveal as="dl" delay={100} className="divide-y divide-white/15">
            {t('hotelPage.practical.items').map((item) => (
              <div key={item.label} className="flex flex-wrap justify-between gap-2 py-4 text-[14.5px]">
                <dt className="text-white/65">{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <Container as="section" className="py-20 md:py-28">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">{t('hotelPage.gallery')}</h2>
        </Reveal>
        <div className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4">
          {gallery.map((name, i) => (
            <Reveal key={name} delay={i * 80} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
              <Img name={name} alt="" sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'} className="size-full" />
            </Reveal>
          ))}
        </div>
      </Container>

      <CtaBanner image="garden" />
    </>
  );
}
