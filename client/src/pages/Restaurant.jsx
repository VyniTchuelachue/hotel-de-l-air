import { BellRing, Coffee, Moon, Phone, Sun } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { CtaBanner, PageHero, SectionIntro } from '../components/sections.jsx';
import { AsideLabel, Button, Container, Img, Title } from '../components/ui.jsx';
import { hotel } from '../data/hotel.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';

const serviceIcons = [Coffee, Sun, Moon, BellRing];

export default function Restaurant() {
  const { t } = useLanguage();
  usePageTitle('restaurant');

  return (
    <>
      <PageHero image="restaurantPlants" {...t('restaurantPage.hero')} />

      <Container as="section" className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <SectionIntro eyebrow={t('restaurantPage.intro.eyebrow')} title={t('restaurantPage.intro.title')} />
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted">{t('restaurantPage.intro.text')}</p>
        </Reveal>
        <Reveal delay={120} className="grid grid-cols-2 gap-3">
          <Img name="dish" alt="" sizes="(min-width: 1024px) 26vw, 50vw" className="aspect-[3/4] w-full" />
          <Img name="dining" alt="" sizes="(min-width: 1024px) 26vw, 50vw" className="mt-12 aspect-[3/4] w-full" />
        </Reveal>
      </Container>

      <Container as="section" className="pb-20 md:pb-28">
        <ul className="grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
          {t('restaurantPage.services').map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <Reveal as="li" key={s.title} delay={i * 90} className="bg-cream p-8">
                <Icon className="size-7 text-forest" strokeWidth={1} />
                <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </Container>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[380px] overflow-hidden lg:min-h-[560px]">
          <Img name="bar" alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 size-full" />
          <AsideLabel words={t('restaurantPage.bar.aside')} className="absolute right-7 top-8 text-right [&>span:last-child]:ml-auto" />
        </div>
        <div className="flex items-center bg-forest-dark text-white">
          <Reveal className="px-6 py-16 sm:px-12 lg:px-16">
            <p className="eyebrow text-white/60">{t('restaurantPage.bar.eyebrow')}</p>
            <Title lines={t('restaurantPage.bar.title')} className="mt-4 text-4xl md:text-5xl" />
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/80">{t('restaurantPage.bar.text')}</p>
            <div className="mt-10 border-t border-white/15 pt-8">
              <h3 className="font-display text-2xl">{t('restaurantPage.reserve.title')}</h3>
              <p className="mt-2 text-[14px] text-white/70">{t('restaurantPage.reserve.text')}</p>
              <Button href={hotel.phoneHref} variant="white" arrow={false} className="mt-6">
                <Phone className="size-4" strokeWidth={1.5} />
                {hotel.phone}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
