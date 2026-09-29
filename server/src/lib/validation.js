import catalog from '../../../shared/rooms.json' with { type: 'json' };

export const { rooms, currency, maxRoomsPerBooking, maxNights } = catalog;
const maxCapacity = Math.max(...rooms.map((r) => r.capacity));

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]{6,25}$/;

export function isIsoDate(value) {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function nightsBetween(checkIn, checkOut) {
  return Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000);
}

/** Today's date in Douala, as YYYY-MM-DD. */
export function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Douala' }).format(new Date());
}

function toInt(value) {
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

/** Validates the stay part of a search or booking. Returns { errors, stay }. */
export function validateStay(input) {
  const errors = {};
  const checkIn = input.checkIn;
  const checkOut = input.checkOut;
  const guests = toInt(input.guests ?? 2);
  const roomCount = toInt(input.rooms ?? 1);

  if (!isIsoDate(checkIn)) errors.checkIn = 'invalid';
  else if (checkIn < today()) errors.checkIn = 'past_date';
  else if (checkIn > addDays(today(), 365)) errors.checkIn = 'too_far';

  if (!isIsoDate(checkOut)) errors.checkOut = 'invalid';
  else if (!errors.checkIn && checkOut <= checkIn) errors.checkOut = 'order';
  else if (!errors.checkIn && nightsBetween(checkIn, checkOut) > maxNights) errors.checkOut = 'too_many_nights';

  if (!(roomCount >= 1 && roomCount <= maxRoomsPerBooking)) errors.rooms = 'invalid';
  if (!(guests >= 1 && guests <= (roomCount || 1) * maxCapacity)) errors.guests = 'capacity';

  return {
    errors,
    stay: { checkIn, checkOut, guests, rooms: roomCount, nights: nightsBetween(checkIn, checkOut) },
  };
}

function text(value, { required = false, min = 0, max }) {
  const v = typeof value === 'string' ? value.trim() : '';
  if (!v) return required ? { error: 'required' } : { value: '' };
  if (v.length < min) return { error: 'invalid' };
  if (v.length > max) return { error: 'too_long' };
  return { value: v };
}

/** Validates guest contact fields shared by bookings and contact messages. */
export function validateContact(input, { requirePhone = false, requireMessage = false } = {}) {
  const errors = {};
  const out = {};
  const fields = {
    name: text(input.name, { required: true, min: 2, max: 100 }),
    email: text(input.email, { required: true, max: 150 }),
    phone: text(input.phone, { required: requirePhone, max: 30 }),
    subject: text(input.subject, { max: 150 }),
    message: text(input.message, { required: requireMessage, min: requireMessage ? 5 : 0, max: 2000 }),
  };
  for (const [key, { error, value }] of Object.entries(fields)) {
    if (error) errors[key] = error;
    else out[key] = value;
  }
  if (!errors.email && !EMAIL.test(out.email)) errors.email = 'invalid';
  if (!errors.phone && out.phone && !PHONE.test(out.phone)) errors.phone = 'invalid';
  return { errors, contact: out };
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
