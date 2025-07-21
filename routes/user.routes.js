import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js';
import { getUsers, getUser } from '../controllers/user.controller.js'

const userRouter = Router();

// GET /users -> get all users
// GET /users/:id -> get user by id

userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) => res.send({title: 'CREAT new user' }));

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE user' }));

userRouter.delete('/:id', (req, res) => res.send({title: 'DELETE user' }));

export default userRouter;
