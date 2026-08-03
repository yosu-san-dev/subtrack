const errorMiddleware = (err, req, res, next) => {
    try {
        console.error(err);

        const statusCode = err.status || err.statusCode || 500;
        const message = err.message || 'Server Error';

        // SQLite constraint errors
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ success: false, error: 'Duplicate entry — this record already exists' });
        }

        if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).json({ success: false, error: 'Referenced resource does not exist' });
        }

        res.status(statusCode).json({ success: false, error: message });
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;