import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { hotel } from '../data/hotel.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import Logo from './Logo.jsx';
import { Button } from './ui.jsx';

export const navItems = [
  { to: '/hotel', key: 'hotel' },
  { to: '/chambres', key: 'rooms' },
  { to: '/restaurant', key: 'restaurant' },
  { to: '/experiences', key: 'experiences' },
  { to: '/contact', key: 'contact' },
];

function LanguageSwitch({ className = '' }) {
  const { lang, setLang, t } = useLanguage();
  return (
    <div className={`flex items-center gap-2 text-[12px] tracking-[0.15em] ${className}`} role="group" aria-label={t('nav.language')}>
      {['fr', 'en'].map((code, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span className="text-line">/</span>}
          <button
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={`uppercase transition-colors ${lang === code ? 'font-medium text-ink' : 'text-muted hover:text-ink'}`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}

export default function Header() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
    <header
      className={`sticky top-0 z-40 border-b bg-cream/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'border-line shadow-[0_6px_24px_-18px_rgba(0,0,0,0.35)]' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <Logo />

        <nav className="hidden lg:block" aria-label="Navigation principale">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative py-2 text-[13.5px] tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-forest after:transition-transform after:duration-300 ${
                      isActive ? 'text-forest after:scale-x-100' : 'text-ink/80 after:scale-x-0 hover:text-ink hover:after:scale-x-100'
                    }`
                  }
                >
                  {t(`nav.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <LanguageSwitch className="hidden sm:flex" />
          <Button to="/reservation" className="hidden !px-5 !py-2.5 sm:inline-flex">
            {t('nav.book')}
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="-mr-2 p-2 lg:hidden"
            aria-label={t('nav.menu')}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="size-6" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </header>

      {/* Mobile menu, outside <header>: its backdrop-filter would trap position:fixed */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 flex flex-col bg-cream transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-[72px] items-center justify-between px-5">
          <Logo />
          <button type="button" onClick={() => setOpen(false)} className="-mr-2 p-2" aria-label={t('nav.close')}>
            <X className="size-6" strokeWidth={1.25} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center px-8" aria-label="Navigation mobile">
          <ul className="space-y-2">
            {[{ to: '/', key: 'home' }, ...navItems].map((item, i) => (
              <li
                key={item.to}
                className={`transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
              >
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `block py-1.5 font-display text-4xl ${isActive ? 'text-forest italic' : 'text-ink'}`
                  }
                >
                  {t(`nav.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-6 border-t border-line px-8 py-8">
          <Button to="/reservation" className="w-full">
            {t('nav.book')}
          </Button>
          <div className="flex items-center justify-between">
            <a href={hotel.phoneHref} className="flex items-center gap-2 text-sm text-muted">
              <Phone className="size-4" strokeWidth={1.5} /> {hotel.phone}
            </a>
            <LanguageSwitch />
          </div>
        </div>
      </div>
    </>
  );
}
