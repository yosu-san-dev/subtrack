import Subscription from '../models/subscription.model.js';

const VALID_FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'];
const VALID_STATUSES = ['active', 'cancelled', 'expired'];

/**
 * Creates a new subscription for an account.
 * @param {number} accountId
 * @param {object} data
 * @returns {object}
 */
export const createSubscription = (accountId, data) => {
    const { name, price, currency, frequency, category, payment_method, start_date } = data;

    if (!name || !price || !frequency || !category || !payment_method || !start_date) {
        const error = new Error('Missing required fields: name, price, frequency, category, payment_method, start_date');
        error.status = 400;
        throw error;
    }

    if (!VALID_FREQUENCIES.includes(frequency)) {
        const error = new Error(`Invalid frequency. Must be one of: ${VALID_FREQUENCIES.join(', ')}`);
        error.status = 400;
        throw error;
    }

    return Subscription.create({ account_id: accountId, ...data });
};

/**
 * Gets all subscriptions for an account.
 * @param {number} accountId
 * @returns {object[]}
 */
export const getSubscriptions = (accountId) => {
    return Subscription.findByAccount(accountId);
};

/**
 * Gets a single subscription with ownership check.
 * @param {number} id
 * @param {number} accountId
 * @returns {object}
 */
export const getSubscription = (id, accountId) => {
    const subscription = Subscription.findById(id);

    if (!subscription) {
        const error = new Error('Subscription not found');
        error.status = 404;
        throw error;
    }

    if (subscription.account_id !== accountId) {
        const error = new Error('This subscription does not belong to your active account');
        error.status = 403;
        throw error;
    }

    return subscription;
};

/**
 * Updates a subscription.
 * @param {number} id
 * @param {number} accountId
 * @param {object} data
 * @returns {object}
 */
export const updateSubscription = (id, accountId, data) => {
    // Ownership check
    getSubscription(id, accountId);

    if (data.frequency && !VALID_FREQUENCIES.includes(data.frequency)) {
        const error = new Error(`Invalid frequency. Must be one of: ${VALID_FREQUENCIES.join(', ')}`);
        error.status = 400;
        throw error;
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
        const error = new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
        error.status = 400;
        throw error;
    }

    return Subscription.update(id, data);
};

/**
 * Cancels a subscription.
 * @param {number} id
 * @param {number} accountId
 * @returns {object}
 */
export const cancelSubscription = (id, accountId) => {
    getSubscription(id, accountId);
    return Subscription.update(id, { status: 'cancelled' });
};

/**
 * Deletes a subscription.
 * @param {number} id
 * @param {number} accountId
 */
export const deleteSubscription = (id, accountId) => {
    getSubscription(id, accountId);
    Subscription.delete(id);
};

/**
 * Gets subscriptions renewing within N days.
 * @param {number} accountId
 * @param {number} days
 * @returns {object[]}
 */
export const getUpcomingRenewals = (accountId, days = 7) => {
    return Subscription.findUpcomingRenewals(accountId, days);
};
