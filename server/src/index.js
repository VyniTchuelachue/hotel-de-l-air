import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import api from './routes/api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// `--port` (used by `npm run dev`, where Vite proxies /api to 4000) wins over the PORT set by hosts.
const { values: args } = parseArgs({ options: { port: { type: 'string' } }, strict: false });
const PORT = Number(args.port || process.env.PORT) || 4000;
const clientDist = path.resolve(__dirname, '../../client/dist');

const app = express();
app.disable('x-powered-by');
// Behind a proxy (always the case on Vercel) the visitor's IP is in X-Forwarded-For;
// the rate limiter needs it, otherwise every visitor would share one limit.
const trustProxy = process.env.TRUST_PROXY || (process.env.VERCEL ? '1' : '');
if (trustProxy) app.set('trust proxy', Number(trustProxy) || trustProxy);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'https://images.unsplash.com'],
        'frame-src': ['https://www.google.com', 'https://maps.google.com'],
        'connect-src': ["'self'"],
      },
    },
  }),
);

// Only needed when the React app is hosted on a different domain than the API.
if (process.env.CORS_ORIGIN) app.use('/api', cors({ origin: process.env.CORS_ORIGIN.split(',') }));

app.use(express.json({ limit: '20kb' }));
app.use('/api', api);
app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }));

// In production the same server also serves the built React app.
if (existsSync(clientDist)) {
  app.use('/assets', express.static(path.join(clientDist, 'assets'), { immutable: true, maxAge: '1y' }));
  app.use(express.static(clientDist, { index: false }));
  app.get('/{*splat}', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'invalid_json' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'too_large' });
  console.error(err);
  res.status(500).json({ error: 'server' });
});

app.listen(PORT, () => {
  console.log(`Hôtel de l'Air API → http://localhost:${PORT}`);
});
