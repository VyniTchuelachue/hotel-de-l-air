# Hôtel de l'Air — website

Website for Hôtel de l'Air (Bonapriso, Douala): React + Tailwind CSS front end, Node.js (Express) API.

```
client/   React 19 + Vite + Tailwind CSS 4 (the website)
server/   Express 5 API (availability, booking requests, contact messages)
shared/   rooms.json — room prices, sizes and inventory, used by both
```

## Run it

Requires Node.js 22.22 or newer.

```bash
npm install
npm run dev          # website on http://localhost:5173, API on http://localhost:4000
```

Production (one Node process serves both the API and the built site):

```bash
npm run build
npm start            # http://localhost:4000 (or the PORT your host sets)
```

## Where to change things

| What | File |
| --- | --- |
| Prices, room sizes, number of rooms per type | `shared/rooms.json` |
| Phone, email, address, social links, map | `client/src/data/hotel.js` |
| Photos (Unsplash placeholders → your own) | `client/src/data/images.js` |
| All texts, French and English | `client/src/i18n/fr.js`, `client/src/i18n/en.js` |
| Colours and fonts | `client/src/index.css` (`@theme`) |

To use your own photos, put them in `client/public/images/` and replace a value in
`images.js` with its path, e.g. `hero: '/images/chambre-executive.jpg'`.

## Booking requests and messages

The site doesn't take payments. Guests send a booking request; the API checks availability
(so a room type can't be booked beyond its `inventory`), saves it with a reference like
`HDA-7K2P9Q`, and notifies the hotel.

- Requests and messages are stored in `server/data/reservations.json` and `messages.json`.
- Copy `server/.env.example` to `server/.env` and fill in the SMTP settings to receive each
  request by email (otherwise they are printed in the server console).
- Set `ADMIN_TOKEN` in `server/.env` to list them:

```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:4000/api/admin/reservations
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:4000/api/admin/messages
```

## API

| Method | Route | |
| --- | --- | --- |
| GET | `/api/rooms` | Room catalogue |
| GET | `/api/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&guests=2&rooms=1` | Free rooms and totals |
| POST | `/api/reservations` | Booking request |
| POST | `/api/contact` | Contact message |

## Hosting

### Vercel

`vercel.json` deploys the site (`client`, Vite) and the API (`server`, Express) as two
[Vercel Services](https://vercel.com/docs/services) on one domain: `/api/*` goes to the API,
everything else to the site.

1. Import the GitHub repository in Vercel.
2. In **Settings → Build and Deployment**, set the **Framework Preset** to **Services**
   (the `services` block in `vercel.json` is only used with that preset).
3. In **Settings → Environment Variables**, add `HOTEL_EMAIL` and the `SMTP_*` variables from
   `server/.env.example`, plus `ADMIN_TOKEN` if you want the admin routes.

On Vercel the API can only write to a temporary folder that is cleared regularly, so the
**email notifications are the lasting record** of booking requests and messages: set up SMTP
before going live. For permanent storage (and reliable availability checks), connect a
database from the Vercel Marketplace.

### Any Node host

Render, Railway, a VPS with PM2…: run `npm install && npm run build`, then `npm start`.
Keep `server/data/` on persistent storage (or point `DATA_DIR` to it), and set
`TRUST_PROXY=1` when running behind a reverse proxy.
