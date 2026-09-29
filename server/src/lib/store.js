import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vercel Functions can only write to the temp folder, which is wiped between instances:
// there, the emails sent by notify.js are the lasting record of each request.
function dataDir() {
  if (process.env.DATA_DIR) return path.resolve(process.env.DATA_DIR);
  if (process.env.VERCEL) return path.join(tmpdir(), 'hotel-de-l-air');
  return path.resolve(__dirname, '../../data');
}
const DATA_DIR = dataDir();

/**
 * Minimal JSON-file collection. Every write goes through a single queue so
 * concurrent requests can't interleave (e.g. two bookings for the last room).
 */
export function createCollection(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  let items = null;
  let queue = Promise.resolve();

  async function load() {
    if (items) return items;
    try {
      items = JSON.parse(await readFile(file, 'utf8'));
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      items = [];
    }
    return items;
  }

  async function persist() {
    await mkdir(DATA_DIR, { recursive: true });
    const tmp = `${file}.tmp`;
    await writeFile(tmp, JSON.stringify(items, null, 2));
    await rename(tmp, file);
  }

  function enqueue(task) {
    const run = queue.then(task);
    queue = run.catch(() => {});
    return run;
  }

  return {
    all: () => enqueue(async () => [...(await load())]),

    /** Runs `fn(items)` exclusively; if it returns `{ insert }`, that item is saved. */
    transaction: (fn) =>
      enqueue(async () => {
        const result = await fn(await load());
        if (result?.insert) {
          items.push(result.insert);
          await persist();
        }
        return result;
      }),
  };
}

export const reservations = createCollection('reservations');
export const messages = createCollection('messages');
