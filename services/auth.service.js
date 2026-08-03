import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import Account from '../models/account.model.js';

/**
 * Generates a random 64-byte hex token.
 * @returns {string}
 */
const generateToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

/**
 * Registers a new user.
 * Creates the user, a default "Personal" account, and a session.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ token: string, user: object, account: object }}
 */
export const register = async (name, email, password) => {
    // Check if user already exists
    const existing = User.findByEmail(email);
    if (existing) {
        const error = new Error('User already exists');
        error.status = 409;
        throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = User.create({ name, email, password: hashedPassword });

    // Create default account
    const account = Account.create(user.id, 'Personal', 'personal');

    // Create session with default account as active
    const token = generateToken();
    Session.create(user.id, token, account.id);

    return { token, user, account };
};

/**
 * Logs in a user.
 * Verifies credentials and creates a new session.
 * @param {string} email
 * @param {string} password
 * @returns {{ token: string, user: object }}
 */
export const login = async (email, password) => {
    const user = User.findByEmail(email);
    if (!user) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
    }

    // Get user's first account as default active account
    const accounts = Account.findByUser(user.id);
    const activeAccountId = accounts.length > 0 ? accounts[0].id : null;

    // Create session
    const token = generateToken();
    Session.create(user.id, token, activeAccountId);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
};

/**
 * Logs out a user by deleting their session.
 * @param {string} token
 */
export const logout = (token) => {
    Session.deleteByToken(token);
};
