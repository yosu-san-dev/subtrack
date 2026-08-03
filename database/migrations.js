/**
 * Runs all table creation statements.
 * Safe to call multiple times — uses IF NOT EXISTS.
 */
export const runMigrations = (db) => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            email      TEXT NOT NULL UNIQUE,
            password   TEXT NOT NULL,
            role       TEXT NOT NULL DEFAULT 'user',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id                INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token             TEXT NOT NULL UNIQUE,
            active_account_id INTEGER,
            created_at        TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS accounts (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            name       TEXT NOT NULL,
            type       TEXT DEFAULT 'personal',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS categories (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER,
            name       TEXT NOT NULL,
            scope      TEXT DEFAULT 'general',
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS subscriptions (
            id             INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id     INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            name           TEXT NOT NULL,
            price          REAL NOT NULL,
            currency       TEXT DEFAULT 'USD',
            frequency      TEXT NOT NULL,
            category       TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            status         TEXT DEFAULT 'active',
            start_date     TEXT NOT NULL,
            renewal_date   TEXT,
            created_at     TEXT DEFAULT (datetime('now')),
            updated_at     TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS payments (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id      INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            subscription_id INTEGER REFERENCES subscriptions(id),
            amount          REAL NOT NULL,
            currency        TEXT DEFAULT 'USD',
            payment_date    TEXT NOT NULL,
            description     TEXT,
            category        TEXT NOT NULL,
            payment_type    TEXT NOT NULL,
            notes           TEXT,
            created_at      TEXT DEFAULT (datetime('now'))
        );
    `);
};
