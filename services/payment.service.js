import Payment from '../models/payment.model.js';
import Category from '../models/category.model.js';

const VALID_PAYMENT_TYPES = ['periodic', 'one-time', 'other'];

/**
 * Creates a new payment for an account.
 * @param {number} accountId
 * @param {number} userId - for category validation
 * @param {object} data
 * @returns {object}
 */
export const createPayment = (accountId, userId, data) => {
    const { amount, payment_date, category, payment_type } = data;

    if (!amount || !payment_date || !category || !payment_type) {
        const error = new Error('Missing required fields: amount, payment_date, category, payment_type');
        error.status = 400;
        throw error;
    }

    if (!VALID_PAYMENT_TYPES.includes(payment_type)) {
        const error = new Error(`Invalid payment_type. Must be one of: ${VALID_PAYMENT_TYPES.join(', ')}`);
        error.status = 400;
        throw error;
    }

    // Validate category exists (system or user's custom)
    const categoryExists = Category.findByName(category, userId);
    if (!categoryExists) {
        const error = new Error(`Category '${category}' does not exist. Create it first or use a system category.`);
        error.status = 400;
        throw error;
    }

    return Payment.create({ account_id: accountId, ...data });
};

/**
 * Gets all payments for an account with optional filters.
 * @param {number} accountId
 * @param {{ category?: string, type?: string, from?: string, to?: string }} filters
 * @returns {object[]}
 */
export const getPayments = (accountId, filters = {}) => {
    return Payment.findByAccount(accountId, filters);
};

/**
 * Gets a single payment with ownership check.
 * @param {number} id
 * @param {number} accountId
 * @returns {object}
 */
export const getPayment = (id, accountId) => {
    const payment = Payment.findById(id);

    if (!payment) {
        const error = new Error('Payment not found');
        error.status = 404;
        throw error;
    }

    if (payment.account_id !== accountId) {
        const error = new Error('This payment does not belong to your active account');
        error.status = 403;
        throw error;
    }

    return payment;
};

/**
 * Deletes a payment.
 * @param {number} id
 * @param {number} accountId
 */
export const deletePayment = (id, accountId) => {
    getPayment(id, accountId);
    Payment.delete(id);
};
