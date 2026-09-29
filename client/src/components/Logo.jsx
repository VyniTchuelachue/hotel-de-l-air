import { Link } from 'react-router';

export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`group inline-flex flex-col items-center leading-none ${className}`} aria-label="Hôtel de l'Air — accueil">
      <span className={`font-display text-[22px] font-medium tracking-[0.06em] md:text-[25px] ${light ? 'text-white' : 'text-ink'}`}>
        HÔTEL DE L’AIR
      </span>
      <span className={`mt-1.5 text-[8.5px] tracking-[0.42em] ${light ? 'text-white/70' : 'text-muted'}`}>DOUALA · BONAPRISO</span>
    </Link>
  );
}
