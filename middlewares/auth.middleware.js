import Session from '../models/session.model.js';

const authorize = (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized — no token provided' });
        }

        const session = Session.findByToken(token);

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized — invalid or expired token' });
        }

        // Attach user info and active account to request
        req.user = {
            id: session.user_id,
            name: session.name,
            email: session.email,
            role: session.role,
        };
        req.session = {
            id: session.session_id,
            token: session.token,
            activeAccountId: session.active_account_id,
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

export default authorize;