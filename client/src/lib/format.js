const locale = (lang) => (lang === 'en' ? 'en-GB' : 'fr-FR');

export const formatPrice = (amount, lang) => `${new Intl.NumberFormat(locale(lang)).format(amount)} F CFA`;

/** "2026-10-04" → "4 oct. 2026" / "4 Oct 2026" */
export function formatDate(iso, lang, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return '';
  return new Intl.DateTimeFormat(locale(lang), options).format(new Date(`${iso}T00:00:00`));
}

/** Local date as YYYY-MM-DD. */
export function toIsoDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toIsoDate(d);
}

export const todayIso = () => toIsoDate(new Date());
