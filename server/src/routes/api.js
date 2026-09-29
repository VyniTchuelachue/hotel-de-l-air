import { randomBytes, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { quote, remainingUnits } from '../lib/availability.js';
import { notifyHotel } from '../lib/notify.js';
import { messages, reservations } from '../lib/store.js';
import { currency, hasErrors, rooms, validateContact, validateStay } from '../lib/validation.js';

const router = Router();

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'rate_limited' },
});

const formatXaf = (n) => `${new Intl.NumberFormat('fr-FR').format(n)} F CFA`;

function newReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(6);
  return `HDA-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`;
}

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

router.get('/rooms', (req, res) => {
  res.json({ currency, rooms: rooms.map(({ inventory, ...room }) => room) });
});

router.get('/availability', async (req, res) => {
  const { errors, stay } = validateStay(req.query);
  if (hasErrors(errors)) return res.status(400).json({ error: 'validation', fields: errors });

  const booked = await reservations.all();
  res.json({
    ...stay,
    currency,
    rooms: rooms.map((room) => {
      const remaining = remainingUnits(room, booked, stay.checkIn, stay.checkOut);
      return {
        id: room.id,
        price: room.price,
        total: quote(room, stay),
        remaining,
        available: remaining >= stay.rooms && stay.guests <= room.capacity * stay.rooms,
      };
    }),
  });
});

router.post('/reservations', formLimiter, async (req, res) => {
  const body = req.body ?? {};
  // Honeypot field: real visitors never see it, bots tend to fill it in.
  if (body.website) return res.status(201).json({ reference: newReference() });

  const room = rooms.find((r) => r.id === body.roomId);
  const { errors: stayErrors, stay } = validateStay(body);
  const { errors: contactErrors, contact } = validateContact(body, { requirePhone: true });
  const errors = { ...stayErrors, ...contactErrors };
  if (!room) errors.roomId = 'invalid';
  else if (!stayErrors.guests && stay.guests > room.capacity * stay.rooms) errors.guests = 'capacity';
  const promoCode = typeof body.promoCode === 'string' ? body.promoCode.trim().slice(0, 30) : '';
  if (hasErrors(errors)) return res.status(400).json({ error: 'validation', fields: errors });

  const result = await reservations.transaction((all) => {
    if (remainingUnits(room, all, stay.checkIn, stay.checkOut) < stay.rooms) return { unavailable: true };
    return {
      insert: {
        reference: newReference(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        roomId: room.id,
        ...stay,
        pricePerNight: room.price,
        total: quote(room, stay),
        currency,
        promoCode,
        lang: body.lang === 'en' ? 'en' : 'fr',
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
      },
    };
  });

  if (result.unavailable) return res.status(409).json({ error: 'unavailable' });

  const r = result.insert;
  // Awaited (it never throws): on serverless hosts, work left running after the reply may be cut off.
  await notifyHotel({
    subject: `Nouvelle demande de réservation ${r.reference} — ${r.name}`,
    replyTo: r.email,
    lines: [
      `Référence : ${r.reference}`,
      `Chambre : ${room.id} × ${r.rooms}`,
      `Séjour : du ${r.checkIn} au ${r.checkOut} (${r.nights} nuit${r.nights > 1 ? 's' : ''})`,
      `Voyageurs : ${r.guests}`,
      `Total estimé : ${formatXaf(r.total)}`,
      r.promoCode && `Code promo : ${r.promoCode}`,
      '',
      `Client : ${r.name}`,
      `E-mail : ${r.email}`,
      `Téléphone : ${r.phone}`,
      r.message && `\nDemande particulière :\n${r.message}`,
    ],
  });

  res.status(201).json({
    reference: r.reference,
    roomId: r.roomId,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    nights: r.nights,
    rooms: r.rooms,
    guests: r.guests,
    total: r.total,
    currency,
  });
});

router.post('/contact', formLimiter, async (req, res) => {
  const body = req.body ?? {};
  if (body.website) return res.status(201).json({ ok: true });

  const { errors, contact } = validateContact(body, { requireMessage: true });
  if (hasErrors(errors)) return res.status(400).json({ error: 'validation', fields: errors });

  const message = { id: randomBytes(8).toString('hex'), createdAt: new Date().toISOString(), ...contact };
  await messages.transaction(() => ({ insert: message }));

  await notifyHotel({
    subject: `Nouveau message du site — ${message.subject || message.name}`,
    replyTo: message.email,
    lines: [
      `De : ${message.name} <${message.email}>`,
      message.phone && `Téléphone : ${message.phone}`,
      message.subject && `Objet : ${message.subject}`,
      '',
      message.message,
    ],
  });

  res.status(201).json({ ok: true });
});

/* ---- Admin: read booking requests and messages (Authorization: Bearer <ADMIN_TOKEN>) ---- */

function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return res.status(404).json({ error: 'not_found' });
  const given = (req.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return res.status(401).json({ error: 'unauthorized' });
  next();
}

router.get('/admin/reservations', requireAdmin, async (req, res) => {
  res.json((await reservations.all()).reverse());
});

router.get('/admin/messages', requireAdmin, async (req, res) => {
  res.json((await messages.all()).reverse());
});

export default router;
