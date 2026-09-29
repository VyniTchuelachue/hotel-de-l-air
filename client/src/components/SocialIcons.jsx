// Brand marks are not part of lucide-react, so they are drawn here in the same line style.
const props = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function InstagramIcon({ className = 'size-4' }) {
  return (
    <svg {...props} className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className = 'size-4' }) {
  return (
    <svg {...props} className={className}>
      <path d="M17 2.5h-2.8A4.7 4.7 0 0 0 9.5 7.2V10H7v3.8h2.5v7.7h3.8v-7.7H16l.6-3.8h-3.3V7.6c0-.6.4-1.1 1-1.1H17z" />
    </svg>
  );
}
