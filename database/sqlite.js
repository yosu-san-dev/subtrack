import Database from 'better-sqlite3';
import path from 'path';
import { DB_PATH } from '../config/env.js';
import { runMigrations } from './migrations.js';
import { seedCategories } from './seed.js';

const dbPath = DB_PATH || path.join(process.cwd(), 'subtrack.db');

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initializes the database — runs migrations and seeds.
 * Called once on app boot.
 */
export const initDatabase = () => {
    runMigrations(db);
    seedCategories(db);
    console.log(`SQLite database initialized at ${dbPath}`);
};

export default db;
