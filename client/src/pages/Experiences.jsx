import Reveal from '../components/Reveal.jsx';
import { CtaBanner, PageHero } from '../components/sections.jsx';
import { Container, Img } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';

const pictures = ['breakfast', 'pool', 'gym', 'cocktail', 'roomLounge', 'douala'];

export default function Experiences() {
  const { t } = useLanguage();
  usePageTitle('experiences');

  return (
    <>
      <PageHero image="pool" {...t('experiencesPage.hero')} />

      <Container as="section" className="grid gap-x-8 gap-y-16 py-20 md:grid-cols-2 md:py-28 lg:gap-x-12">
        {t('experiencesPage.items').map((item, i) => (
          <Reveal as="article" key={item.title} delay={(i % 2) * 120} className={i % 2 === 1 ? 'md:mt-24' : ''}>
            <div className="overflow-hidden">
              <Img
                name={pictures[i]}
                alt=""
                sizes="(min-width: 768px) 45vw, 100vw"
                className="aspect-[4/3] w-full transition-transform duration-[1.2s] ease-out hover:scale-[1.04]"
              />
            </div>
            <div className="mt-6 flex gap-5">
              <span className="font-display text-xl text-brass">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="font-display text-3xl md:text-4xl">{item.title}</h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{item.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </Container>

      <CtaBanner />
    </>
  );
}
