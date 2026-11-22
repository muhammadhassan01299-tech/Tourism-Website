import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const { Pool } = pg;

export function defaultDb() {
  return {
    version: 1,
    // null = "use the built-in defaults from src/data/siteConfig.ts"
    destinations: null,
    featuredPackages: null,
    specialOffer: null,
    brand: null,
    pricing: null,
    media: { logoUrl: null, ownerPhotoUrl: null, imageOverrides: {} },
    bookings: [],
    inquiries: [],
    users: [],
  };
}

export function createStore(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, 'db.json');
  let db = defaultDb();
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const pool = databaseUrl
    ? new Pool({
        connectionString: databaseUrl,
        ssl: process.env.PGSSL === 'disable' ? false : { rejectUnauthorized: false },
        max: Number(process.env.PGPOOL_MAX || 5),
      })
    : null;

  try {
    const raw = fs.readFileSync(file, 'utf8');
    db = { ...defaultDb(), ...JSON.parse(raw) };
    db.media = { ...defaultDb().media, ...(db.media || {}) };
  } catch (err) {
    if (err && err.code !== 'ENOENT') {
      // Corrupt file: keep a copy so nothing is silently lost, then start clean.
      try {
        fs.copyFileSync(file, `${file}.corrupt-${Date.now()}`);
      } catch {
        // ignore
      }
      console.error('[store] db.json could not be read; a backup copy was saved and a fresh DB started.');
    }
  }

  let saveQueue = Promise.resolve();

  async function loadPostgres() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pak_tourist_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    const result = await pool.query('SELECT data FROM pak_tourist_state WHERE id = 1');
    if (result.rows[0]?.data) {
      db = { ...defaultDb(), ...result.rows[0].data };
      db.media = { ...defaultDb().media, ...(db.media || {}) };
      return;
    }

    // First production boot can migrate the existing local data/db.json.
    await pool.query(
      `INSERT INTO pak_tourist_state (id, data) VALUES (1, $1::jsonb) ON CONFLICT (id) DO NOTHING`,
      [JSON.stringify(db)]
    );
  }

  const ready = pool ? loadPostgres() : Promise.resolve();

  function save() {
    const tmp = `${file}.tmp-${process.pid}`;
    if (!databaseUrl) {
      fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
      fs.renameSync(tmp, file);
      return;
    }
    saveQueue = saveQueue.then(() => pool.query(
      `INSERT INTO pak_tourist_state (id, data, updated_at) VALUES (1, $1::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [JSON.stringify(db)]
    ));
    return saveQueue;
  }

  return {
    get data() {
      return db;
    },
    save,
    ready,
    database: Boolean(databaseUrl),
    file,
  };
}
