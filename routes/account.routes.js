import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { getAccounts, createAccount, getAccount, updateAccount, deleteAccount, switchAccount } from '../controllers/account.controller.js';

const accountRouter = Router();

accountRouter.get('/', authorize, getAccounts);
accountRouter.post('/', authorize, createAccount);
accountRouter.get('/:id', authorize, getAccount);
accountRouter.put('/:id', authorize, updateAccount);
accountRouter.delete('/:id', authorize, deleteAccount);
accountRouter.post('/:id/switch', authorize, switchAccount);

export default accountRouter;
