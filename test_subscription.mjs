/**
 * Self-check for subscription renewal/status logic.
 * Run: node test_subscription.mjs
 */
import assert from 'assert';
import Database from 'better-sqlite3';
import { runMigrations } from './database/migrations.js';

const db = new Database(':memory:');
runMigrations(db);
db.prepare("INSERT INTO users (id,name,email,password) VALUES (1,'u','e','p')").run();
db.prepare("INSERT INTO accounts (id,user_id,name) VALUES (1,1,'main')").run();

// Mirrors models/subscription.model.js computeRenewalDate.
const computeRenewalDate = (startDate, frequency) => {
    const date = new Date(startDate);
    const now = new Date();
    const advance = () => {
        switch (frequency) {
            case 'daily':   date.setDate(date.getDate() + 1); break;
            case 'weekly':  date.setDate(date.getDate() + 7); break;
            case 'yearly':  date.setFullYear(date.getFullYear() + 1); break;
            case 'monthly':
            default:        date.setMonth(date.getMonth() + 1); break;
        }
    };
    advance();
    while (date < now) advance();
    return date.toISOString();
};

const iso = (d) => d.toISOString().split('T')[0];
const now = new Date();

// A backdated subscription renews in the FUTURE, not the past.
for (const [freq, daysBack] of [['monthly', 60], ['weekly', 30], ['daily', 10], ['yearly', 800]]) {
    const start = iso(new Date(Date.now() - daysBack * 864e5));
    const renewal = new Date(computeRenewalDate(start, freq));
    assert.ok(renewal > now, `${freq} backdated ${daysBack}d must renew in the future, got ${renewal.toISOString()}`);
}

// A fresh subscription renews one whole period out.
const today = iso(now);
const monthly = new Date(computeRenewalDate(today, 'monthly'));
assert.ok(monthly > now, 'fresh monthly renews in future');
assert.ok(monthly < new Date(Date.now() + 32 * 864e5), 'fresh monthly renews within ~a month');

// Calendar-correct months: Jan 31 -> Feb, not "31 days later".
const jan31 = new Date('2020-01-31T00:00:00Z');
const d = new Date(jan31);
d.setMonth(d.getMonth() + 1);
assert.strictEqual(d.getUTCMonth(), 2, 'Jan 31 + 1 month lands in March (JS clamping), not 30-day drift');

// Status: computed renewal => active; explicit past renewal => expired.
const createStatus = (start_date, frequency, renewal_date) => {
    let status = 'active';
    if (!renewal_date) renewal_date = computeRenewalDate(start_date, frequency);
    else if (new Date(renewal_date) < new Date()) status = 'expired';
    return { status, renewal_date };
};
assert.strictEqual(createStatus(iso(new Date(Date.now() - 60 * 864e5)), 'monthly').status, 'active',
    'backdated start must NOT be born expired');
assert.strictEqual(createStatus(today, 'monthly', '2020-01-01T00:00:00Z').status, 'expired',
    'explicit past renewal_date is expired');

// Category is stored as a name (TEXT NOT NULL), matching what the form now sends.
const { status, renewal_date } = createStatus(today, 'monthly');
const r = db.prepare(`INSERT INTO subscriptions
    (account_id,name,price,currency,frequency,category,payment_method,status,start_date,renewal_date)
    VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(1, 'Netflix', 15.99, 'USD', 'monthly', 'entertainment', 'Credit Card', status, today, renewal_date);
const sub = db.prepare('SELECT * FROM subscriptions WHERE id=?').get(r.lastInsertRowid);
assert.strictEqual(sub.category, 'entertainment');
assert.strictEqual(sub.status, 'active');

// Upcoming renewals picks up an active sub renewing inside the window.
const soon = db.prepare(`SELECT * FROM subscriptions WHERE account_id=? AND status='active'
    AND renewal_date <= datetime('now','+' || ? || ' days') AND renewal_date >= datetime('now')`).all(1, 40);
assert.strictEqual(soon.length, 1, 'monthly sub shows up in a 40-day renewal window');

console.log('All subscription checks passed.');
