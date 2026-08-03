import db from '../database/sqlite.js';

const Category = {
    /**
     * Gets all categories available to a user (system + custom).
     * @param {number|null} userId - null returns only system categories
     * @returns {object[]}
     */
    getAll(userId) {
        return db.prepare(`
            SELECT * FROM categories
            WHERE user_id IS NULL OR user_id = ?
            ORDER BY user_id IS NOT NULL, name ASC
        `).all(userId);
    },

    /**
     * Finds a category by ID.
     * @param {number} id
     * @returns {object|undefined}
     */
    findById(id) {
        return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    },

    /**
     * Finds a category by name for a specific user (or system).
     * @param {string} name
     * @param {number|null} userId
     * @returns {object|undefined}
     */
    findByName(name, userId) {
        return db.prepare(`
            SELECT * FROM categories
            WHERE name = ? AND (user_id IS NULL OR user_id = ?)
        `).get(name, userId);
    },

    /**
     * Creates a custom category for a user.
     * @param {number} userId
     * @param {string} name
     * @param {string} scope - 'subscription' | 'payment' | 'general'
     * @returns {object} The created category
     */
    create(userId, name, scope = 'general') {
        const stmt = db.prepare(`
            INSERT INTO categories (user_id, name, scope)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(userId, name, scope);
        return Category.findById(result.lastInsertRowid);
    },

    /**
     * Deletes a category by ID.
     * @param {number} id
     */
    delete(id) {
        db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    },
};

export default Category;
