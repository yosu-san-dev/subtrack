import * as authService from '../services/auth.service.js';

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = new Error('Name, email, and password are required');
            error.status = 400;
            throw error;
        }

        const { token, user, account } = await authService.register(name, email, password);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { token, user, account },
        });
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.status = 400;
            throw error;
        }

        const { token, user } = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: { token, user },
        });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            const error = new Error('No token provided');
            error.status = 400;
            throw error;
        }

        authService.logout(token);

        res.status(200).json({
            success: true,
            message: 'Signed out successfully',
        });
    } catch (error) {
        next(error);
    }
};