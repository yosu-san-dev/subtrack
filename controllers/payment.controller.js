import * as paymentService from '../services/payment.service.js';

export const createPayment = (req, res, next) => {
    try {
        const payment = paymentService.createPayment(req.session.activeAccountId, req.user.id, req.body);
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};

export const getPayments = (req, res, next) => {
    try {
        const filters = {
            category: req.query.category,
            type: req.query.type,
            from: req.query.from,
            to: req.query.to,
        };
        const payments = paymentService.getPayments(req.session.activeAccountId, filters);
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        next(error);
    }
};

export const getPayment = (req, res, next) => {
    try {
        const payment = paymentService.getPayment(Number(req.params.id), req.session.activeAccountId);
        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};

export const deletePayment = (req, res, next) => {
    try {
        paymentService.deletePayment(Number(req.params.id), req.session.activeAccountId);
        res.status(200).json({ success: true, message: 'Payment deleted' });
    } catch (error) {
        next(error);
    }
};
