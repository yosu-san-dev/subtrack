import db from '../database/sqlite.js';

const Account = {
    /**
     * Creates a new account for a user.
     * @param {number} userId
     * @param {string} name
     * @param {string} type - 'personal' | 'business' | 'other'
     * @returns {object} The created account
     */
    create(userId, name, type = 'personal') {
        const stmt = db.prepare(`
            INSERT INTO accounts (user_id, name, type)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(userId, name, type);
        return Account.findById(result.lastInsertRowid);
    },

    /**
     * Finds all accounts belonging to a user.
     * @param {number} userId
     * @returns {object[]}
     */
    findByUser(userId) {
        return db.prepare('SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at ASC').all(userId);
    },

    /**
     * Finds an account by ID.
     * @param {number} id
     * @returns {object|undefined}
     */
    findById(id) {
        return db.prepare('SELECT * FROM accounts WHERE id = ?').get(id);
    },

    /**
     * Updates an account's name and/or type.
     * @param {number} id
     * @param {{ name?: string, type?: string }} data
     * @returns {object} The updated account
     */
    update(id, { name, type }) {
        const fields = [];
        const values = [];

        if (name !== undefined) {
            fields.push('name = ?');
            values.push(name);
        }
        if (type !== undefined) {
            fields.push('type = ?');
            values.push(type);
        }

        if (fields.length === 0) return Account.findById(id);

        fields.push("updated_at = datetime('now')");
        values.push(id);

        db.prepare(`UPDATE accounts SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        return Account.findById(id);
    },

    /**
     * Deletes an account by ID.
     * @param {number} id
     */
    delete(id) {
        db.prepare('DELETE FROM accounts WHERE id = ?').run(id);
    },

    /**
     * Counts the number of accounts a user has.
     * @param {number} userId
     * @returns {number}
     */
    countByUser(userId) {
        const row = db.prepare('SELECT COUNT(*) as count FROM accounts WHERE user_id = ?').get(userId);
        return row.count;
    },
};

export default Account;
