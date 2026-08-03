import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { getCategories, createCategory, deleteCategory } from '../controllers/category.controller.js';

const categoryRouter = Router();

categoryRouter.get('/', authorize, getCategories);
categoryRouter.post('/', authorize, createCategory);
categoryRouter.delete('/:id', authorize, deleteCategory);

export default categoryRouter;
