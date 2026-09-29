import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export function usePageTitle(key) {
  const { t } = useLanguage();
  const title = t(`meta.${key}`);
  useEffect(() => {
    document.title = key === 'home' ? `Hôtel de l'Air · ${title}` : `${title} · Hôtel de l'Air`;
  }, [key, title]);
}
