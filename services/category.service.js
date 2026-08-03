import Category from '../models/category.model.js';

/**
 * Gets all categories available to a user (system + custom).
 * @param {number} userId
 * @returns {object[]}
 */
export const getCategories = (userId) => {
    return Category.getAll(userId);
};

/**
 * Creates a custom category for a user.
 * Validates uniqueness (within user scope + system scope).
 * @param {number} userId
 * @param {string} name
 * @param {string} scope
 * @returns {object}
 */
export const createCategory = (userId, name, scope = 'general') => {
    if (!name || name.trim().length === 0) {
        const error = new Error('Category name is required');
        error.status = 400;
        throw error;
    }

    const trimmedName = name.trim().toLowerCase();

    // Check for duplicates (system or user-owned)
    const existing = Category.findByName(trimmedName, userId);
    if (existing) {
        const error = new Error('Category already exists');
        error.status = 409;
        throw error;
    }

    return Category.create(userId, trimmedName, scope);
};

/**
 * Deletes a custom category. System categories cannot be deleted.
 * @param {number} id
 * @param {number} userId
 */
export const deleteCategory = (id, userId) => {
    const category = Category.findById(id);

    if (!category) {
        const error = new Error('Category not found');
        error.status = 404;
        throw error;
    }

    if (category.user_id === null) {
        const error = new Error('Cannot delete a system category');
        error.status = 403;
        throw error;
    }

    if (category.user_id !== userId) {
        const error = new Error('You do not own this category');
        error.status = 403;
        throw error;
    }

    Category.delete(id);
};
