import User from '../models/user.model.js';

export const getUser = (req, res, next) => {
    try {
        const user = User.findById(Number(req.params.id));

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};