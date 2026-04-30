import { createClient } from '@libsql/client';

// Server-side only — never import this in client components
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

let initialized = false;

export async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS packs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      overview TEXT,
      grade_range TEXT,
      theme TEXT,
      category TEXT DEFAULT 'Bible Story',
      is_featured INTEGER DEFAULT 0,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS worksheets (
      id TEXT PRIMARY KEY,
      pack_id TEXT NOT NULL,
      title TEXT,
      grade_level TEXT,
      objective TEXT,
      parent_instructions TEXT,
      content_markup TEXT,
      bible_verse TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE
    );
  `);

  // Safe migrations for existing databases
  const migrations = [
    `ALTER TABLE packs ADD COLUMN category TEXT DEFAULT 'Bible Story'`,
    `ALTER TABLE packs ADD COLUMN is_featured INTEGER DEFAULT 0`,
    `ALTER TABLE subscriptions ADD COLUMN tier TEXT NOT NULL DEFAULT 'free'`,
    `ALTER TABLE subscriptions ADD COLUMN role TEXT`,
  ];
  for (const sql of migrations) {
    try { await db.execute(sql); } catch { /* column already exists */ }
  }

  // Favorites table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS favorites (
      user_id TEXT NOT NULL,
      pack_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, pack_id),
      FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE
    )
  `);

  // Subscriptions table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      user_id TEXT PRIMARY KEY,
      tier TEXT NOT NULL DEFAULT 'free',
      role TEXT,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      status TEXT DEFAULT 'active',
      current_period_end TEXT,
      welcome_sent INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migration: add welcome_sent if it doesn't exist
  try {
    await db.execute("ALTER TABLE subscriptions ADD COLUMN welcome_sent INTEGER DEFAULT 0");
  } catch (e) {}


  initialized = true;
}

/** Call at the top of every API route handler to ensure tables exist. */
export async function ensureDB() {
  if (!initialized) await initDB();
}
