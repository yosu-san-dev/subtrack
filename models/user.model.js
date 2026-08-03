import db from '../database/sqlite.js';

const User = {
    /**
     * Creates a new user.
     * @param {{ name: string, email: string, password: string, role?: string }} data
     * @returns {object} The created user (without password)
     */
    create({ name, email, password, role = 'user' }) {
        const stmt = db.prepare(`
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(name, email, password, role);
        return User.findById(result.lastInsertRowid);
    },

    /**
     * Finds a user by email.
     * @param {string} email
     * @returns {object|undefined}
     */
    findByEmail(email) {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    },

    /**
     * Finds a user by ID.
     * @param {number} id
     * @returns {object|undefined}
     */
    findById(id) {
        return db.prepare('SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?').get(id);
    },

    /**
     * Finds a user by ID including password (for auth checks).
     * @param {number} id
     * @returns {object|undefined}
     */
    findByIdWithPassword(id) {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    },

    /**
     * Updates a user's role.
     * @param {number} id
     * @param {string} role
     * @returns {object}
     */
    updateRole(id, role) {
        db.prepare(`UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?`).run(role, id);
        return User.findById(id);
    },
};

export default User;