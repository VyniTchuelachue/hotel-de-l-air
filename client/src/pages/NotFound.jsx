import { Button, Container, Eyebrow, Title } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { usePageTitle } from '../lib/usePageTitle.js';

export default function NotFound() {
  const { t } = useLanguage();
  usePageTitle('notFound');
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <Eyebrow>404</Eyebrow>
      <Title as="h1" lines={t('notFound.title')} className="mt-4 text-5xl md:text-7xl" />
      <p className="mt-4 max-w-md text-muted">{t('notFound.text')}</p>
      <Button to="/" className="mt-8">
        {t('notFound.home')}
      </Button>
    </Container>
  );
}
