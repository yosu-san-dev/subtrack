const SYSTEM_CATEGORIES = [
    'sports',
    'news',
    'entertainment',
    'lifestyle',
    'technology',
    'finance',
    'politics',
    'other',
];

/**
 * Seeds default system categories (user_id = NULL).
 * Only inserts if no system categories exist yet.
 */
export const seedCategories = (db) => {
    const existing = db.prepare('SELECT COUNT(*) as count FROM categories WHERE user_id IS NULL').get();

    if (existing.count > 0) return;

    const insert = db.prepare('INSERT INTO categories (user_id, name, scope) VALUES (NULL, ?, ?)');

    const seedAll = db.transaction(() => {
        for (const name of SYSTEM_CATEGORIES) {
            insert.run(name, 'general');
        }
    });

    seedAll();
    console.log(`Seeded ${SYSTEM_CATEGORIES.length} system categories`);
};
