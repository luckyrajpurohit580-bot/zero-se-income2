import { neon } from "@neondatabase/serverless";
let ready;
export function sql() { return neon(process.env.DATABASE_URL); }
export function init() {
  if (!ready) {
    ready = (async () => {
      const q = sql();
      await q`CREATE TABLE IF NOT EXISTS bids (
        id SERIAL PRIMARY KEY, order_id TEXT UNIQUE NOT NULL, payment_id TEXT UNIQUE,
        link TEXT NOT NULL, title TEXT NOT NULL, amount_paise INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'created', hidden BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(), paid_at TIMESTAMPTZ)`;
      await q`ALTER TABLE bids ADD COLUMN IF NOT EXISTS business_id INTEGER`;
      await q`CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'other',
        city TEXT NOT NULL, phone TEXT, card_url TEXT,
        phone_public BOOLEAN NOT NULL DEFAULT FALSE, claimed BOOLEAN NOT NULL DEFAULT FALSE,
        hidden BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
      await q`ALTER TABLE businesses ADD COLUMN IF NOT EXISTS about TEXT`;
      await q`ALTER TABLE businesses ADD COLUMN IF NOT EXISTS address TEXT`;
      await q`ALTER TABLE businesses ADD COLUMN IF NOT EXISTS services TEXT`;
      await q`ALTER TABLE businesses ADD COLUMN IF NOT EXISTS instagram TEXT`;
      await q`CREATE UNIQUE INDEX IF NOT EXISTS biz_uniq ON businesses (lower(name), lower(city))`;
    })().catch((e) => { ready = null; throw e; });
  }
  return ready;
}
