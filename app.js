import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { PORT } from './config/env.js';
import { initDatabase } from './database/sqlite.js';

import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import userRouter from './routes/user.routes.js';
import accountRouter from './routes/account.routes.js';
import categoryRouter from './routes/category.routes.js';
import paymentRouter from './routes/payment.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/payments', paymentRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Subtrack API');
});

app.listen(PORT, () => {
    console.log(`Subtrack API is running on http://localhost:${PORT}`);
    initDatabase();
});

export default app;