import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { hotel } from '../data/hotel.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { navItems } from './Header.jsx';
import Logo from './Logo.jsx';
import { FacebookIcon, InstagramIcon } from './SocialIcons.jsx';
import { Container } from './ui.jsx';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-cream">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.3fr] lg:gap-16">
        <div className="max-w-xs">
          <Logo className="!items-start" />
          <p className="mt-5 text-sm leading-relaxed text-muted">{t('footer.tagline')}</p>
          <div className="mt-6 flex gap-3">
            <a
              href={hotel.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-forest hover:bg-forest hover:text-white"
            >
              <InstagramIcon />
            </a>
            <a
              href={hotel.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-forest hover:bg-forest hover:text-white"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        <nav aria-label="Pied de page">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-ink/80 transition-colors hover:text-forest">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/reservation" className="text-forest underline-offset-4 hover:underline">
                {t('nav.book')}
              </Link>
            </li>
          </ul>
        </nav>

        <ul className="space-y-3.5 text-sm text-ink/80">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={1.5} />
            <a href={hotel.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-forest">
              {hotel.street}, {hotel.district}, {hotel.city} — {hotel.country}
            </a>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={1.5} />
            <a href={hotel.phoneHref} className="hover:text-forest">
              {hotel.phone}
            </a>
          </li>
          <li className="flex gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={1.5} />
            <a href={`mailto:${hotel.email}`} className="break-all hover:text-forest">
              {hotel.email}
            </a>
          </li>
          <li className="flex gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={1.5} />
            {t('footer.reception')}
          </li>
        </ul>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {hotel.name}. {t('footer.rights')}
          </p>
          <p>Bonapriso · Douala · Cameroun</p>
        </Container>
      </div>
    </footer>
  );
}
