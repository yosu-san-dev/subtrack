import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import {
    createSubscription,
    getSubscriptions,
    getSubscription,
    updateSubscription,
    deleteSubscription,
    cancelSubscription,
    getUpcomingRenewals,
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getSubscriptions);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);
subscriptionRouter.get('/:id', authorize, getSubscription);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

export default subscriptionRouter;