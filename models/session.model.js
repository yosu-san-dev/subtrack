import db from '../database/sqlite.js';

const Session = {
    /**
     * Creates a new session.
     * @param {number} userId
     * @param {string} token
     * @param {number|null} activeAccountId
     * @returns {object} The created session
     */
    create(userId, token, activeAccountId = null) {
        const stmt = db.prepare(`
            INSERT INTO sessions (user_id, token, active_account_id)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(userId, token, activeAccountId);
        return Session.findById(result.lastInsertRowid);
    },

    /**
     * Finds a session by ID.
     * @param {number} id
     * @returns {object|undefined}
     */
    findById(id) {
        return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
    },

    /**
     * Finds a session by token and joins with user data.
     * @param {string} token
     * @returns {object|undefined}
     */
    findByToken(token) {
        return db.prepare(`
            SELECT
                s.id AS session_id,
                s.token,
                s.active_account_id,
                s.created_at AS session_created_at,
                u.id AS user_id,
                u.name,
                u.email,
                u.role
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = ?
        `).get(token);
    },

    /**
     * Updates the active account on a session.
     * @param {string} token
     * @param {number} accountId
     */
    updateActiveAccount(token, accountId) {
        db.prepare('UPDATE sessions SET active_account_id = ? WHERE token = ?').run(accountId, token);
    },

    /**
     * Deletes a session by token (sign-out).
     * @param {string} token
     */
    deleteByToken(token) {
        db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    },

    /**
     * Deletes all sessions for a user (force sign-out everywhere).
     * @param {number} userId
     */
    deleteAllForUser(userId) {
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
    },
};

export default Session;
