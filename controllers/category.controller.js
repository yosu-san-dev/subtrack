import * as categoryService from '../services/category.service.js';

export const getCategories = (req, res, next) => {
    try {
        const categories = categoryService.getCategories(req.user.id);
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

export const createCategory = (req, res, next) => {
    try {
        const { name, scope } = req.body;
        const category = categoryService.createCategory(req.user.id, name, scope);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = (req, res, next) => {
    try {
        categoryService.deleteCategory(Number(req.params.id), req.user.id);
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        next(error);
    }
};
