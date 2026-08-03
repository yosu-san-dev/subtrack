import db from '../database/sqlite.js';

/**
 * Computes the renewal date from a start date and frequency.
 * @param {string} startDate - ISO date string
 * @param {string} frequency - 'daily' | 'weekly' | 'monthly' | 'yearly'
 * @returns {string} ISO date string
 */
const computeRenewalDate = (startDate, frequency) => {
    const date = new Date(startDate);
    const now = new Date();

    // Advance by whole periods until the renewal lands in the future, so a
    // backdated start_date yields the next upcoming renewal rather than a past one.
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

const Subscription = {
    /**
     * Creates a new subscription.
     * @param {object} data
     * @returns {object} The created subscription
     */
    create({ account_id, name, price, currency = 'USD', frequency, category, payment_method, status = 'active', start_date, renewal_date }) {
        // Auto-compute renewal date if not provided
        if (!renewal_date) {
            renewal_date = computeRenewalDate(start_date, frequency);
        } else if (new Date(renewal_date) < new Date()) {
            // Only an explicitly supplied past renewal_date means expired;
            // a computed one is always in the future.
            status = 'expired';
        }

        const stmt = db.prepare(`
            INSERT INTO subscriptions (account_id, name, price, currency, frequency, category, payment_method, status, start_date, renewal_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(account_id, name, price, currency, frequency, category, payment_method, status, start_date, renewal_date);
        return Subscription.findById(result.lastInsertRowid);
    },

    /**
     * Finds all subscriptions for an account.
     * @param {number} accountId
     * @returns {object[]}
     */
    findByAccount(accountId) {
        return db.prepare('SELECT * FROM subscriptions WHERE account_id = ? ORDER BY created_at DESC').all(accountId);
    },

    /**
     * Finds a subscription by ID.
     * @param {number} id
     * @returns {object|undefined}
     */
    findById(id) {
        return db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(id);
    },

    /**
     * Updates a subscription.
     * @param {number} id
     * @param {object} data - Fields to update
     * @returns {object} The updated subscription
     */
    update(id, data) {
        const allowedFields = ['name', 'price', 'currency', 'frequency', 'category', 'payment_method', 'status', 'start_date', 'renewal_date'];
        const fields = [];
        const values = [];

        for (const key of allowedFields) {
            if (data[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        }

        if (fields.length === 0) return Subscription.findById(id);

        fields.push("updated_at = datetime('now')");
        values.push(id);

        db.prepare(`UPDATE subscriptions SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        return Subscription.findById(id);
    },

    /**
     * Deletes a subscription by ID.
     * @param {number} id
     */
    delete(id) {
        db.prepare('DELETE FROM subscriptions WHERE id = ?').run(id);
    },

    /**
     * Finds subscriptions renewing within N days for an account.
     * @param {number} accountId
     * @param {number} days
     * @returns {object[]}
     */
    findUpcomingRenewals(accountId, days = 7) {
        return db.prepare(`
            SELECT * FROM subscriptions
            WHERE account_id = ?
              AND status = 'active'
              AND renewal_date <= datetime('now', '+' || ? || ' days')
              AND renewal_date >= datetime('now')
            ORDER BY renewal_date ASC
        `).all(accountId, days);
    },
};

export default Subscription;