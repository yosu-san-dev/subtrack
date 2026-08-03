import db from '../database/sqlite.js';

const Payment = {
    /**
     * Creates a new payment record.
     * @param {object} data
     * @returns {object} The created payment
     */
    create({ account_id, subscription_id = null, amount, currency = 'USD', payment_date, description = null, category, payment_type, notes = null }) {
        const stmt = db.prepare(`
            INSERT INTO payments (account_id, subscription_id, amount, currency, payment_date, description, category, payment_type, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(account_id, subscription_id, amount, currency, payment_date, description, category, payment_type, notes);
        return Payment.findById(result.lastInsertRowid);
    },

    /**
     * Finds all payments for an account with optional filters.
     * @param {number} accountId
     * @param {{ category?: string, type?: string, from?: string, to?: string }} filters
     * @returns {object[]}
     */
    findByAccount(accountId, filters = {}) {
        let query = 'SELECT * FROM payments WHERE account_id = ?';
        const params = [accountId];

        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }

        if (filters.type) {
            query += ' AND payment_type = ?';
            params.push(filters.type);
        }

        if (filters.from) {
            query += ' AND payment_date >= ?';
            params.push(filters.from);
        }

        if (filters.to) {
            query += ' AND payment_date <= ?';
            params.push(filters.to);
        }

        query += ' ORDER BY payment_date DESC';

        return db.prepare(query).all(...params);
    },

    /**
     * Finds a payment by ID.
     * @param {number} id
     * @returns {object|undefined}
     */
    findById(id) {
        return db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
    },

    /**
     * Deletes a payment by ID.
     * @param {number} id
     */
    delete(id) {
        db.prepare('DELETE FROM payments WHERE id = ?').run(id);
    },
};

export default Payment;
