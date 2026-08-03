import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createPayment, getPayments, getPayment, deletePayment } from '../controllers/payment.controller.js';

const paymentRouter = Router();

paymentRouter.get('/', authorize, getPayments);
paymentRouter.post('/', authorize, createPayment);
paymentRouter.get('/:id', authorize, getPayment);
paymentRouter.delete('/:id', authorize, deletePayment);

export default paymentRouter;
