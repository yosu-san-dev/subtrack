import Account from '../models/account.model.js';
import Session from '../models/session.model.js';

/**
 * Gets all accounts for a user.
 * @param {number} userId
 * @returns {object[]}
 */
export const getUserAccounts = (userId) => {
    return Account.findByUser(userId);
};

/**
 * Creates a new account for a user.
 * @param {number} userId
 * @param {string} name
 * @param {string} type
 * @returns {object}
 */
export const createAccount = (userId, name, type = 'personal') => {
    if (!name || name.trim().length === 0) {
        const error = new Error('Account name is required');
        error.status = 400;
        throw error;
    }

    return Account.create(userId, name.trim(), type);
};

/**
 * Gets a single account by ID, with ownership check.
 * @param {number} id
 * @param {number} userId
 * @returns {object}
 */
export const getAccount = (id, userId) => {
    const account = Account.findById(id);

    if (!account) {
        const error = new Error('Account not found');
        error.status = 404;
        throw error;
    }

    if (account.user_id !== userId) {
        const error = new Error('You do not own this account');
        error.status = 403;
        throw error;
    }

    return account;
};

/**
 * Updates an account's name/type.
 * @param {number} id
 * @param {number} userId
 * @param {{ name?: string, type?: string }} data
 * @returns {object}
 */
export const updateAccount = (id, userId, data) => {
    // Ownership check
    getAccount(id, userId);
    return Account.update(id, data);
};

/**
 * Deletes an account. Prevents deleting the user's last account.
 * @param {number} id
 * @param {number} userId
 */
export const deleteAccount = (id, userId) => {
    // Ownership check
    getAccount(id, userId);

    const count = Account.countByUser(userId);
    if (count <= 1) {
        const error = new Error('Cannot delete your only account');
        error.status = 400;
        throw error;
    }

    Account.delete(id);
};

/**
 * Switches the active account on the user's current session.
 * @param {string} sessionToken
 * @param {number} accountId
 * @param {number} userId
 * @returns {object} The switched-to account
 */
export const switchAccount = (sessionToken, accountId, userId) => {
    // Verify the user owns the account
    const account = getAccount(accountId, userId);
    Session.updateActiveAccount(sessionToken, accountId);
    return account;
};
