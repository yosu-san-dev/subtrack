import * as subscriptionService from '../services/subscription.service.js';

export const createSubscription = (req, res, next) => {
    try {
        const subscription = subscriptionService.createSubscription(req.session.activeAccountId, req.body);
        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const getSubscriptions = (req, res, next) => {
    try {
        const subscriptions = subscriptionService.getSubscriptions(req.session.activeAccountId);
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};

export const getSubscription = (req, res, next) => {
    try {
        const subscription = subscriptionService.getSubscription(Number(req.params.id), req.session.activeAccountId);
        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = (req, res, next) => {
    try {
        const subscription = subscriptionService.updateSubscription(Number(req.params.id), req.session.activeAccountId, req.body);
        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription = (req, res, next) => {
    try {
        subscriptionService.deleteSubscription(Number(req.params.id), req.session.activeAccountId);
        res.status(200).json({ success: true, message: 'Subscription deleted' });
    } catch (error) {
        next(error);
    }
};

export const cancelSubscription = (req, res, next) => {
    try {
        const subscription = subscriptionService.cancelSubscription(Number(req.params.id), req.session.activeAccountId);
        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingRenewals = (req, res, next) => {
    try {
        const days = req.query.days ? Number(req.query.days) : 7;
        const subscriptions = subscriptionService.getUpcomingRenewals(req.session.activeAccountId, days);
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};