import * as accountService from '../services/account.service.js';

export const getAccounts = (req, res, next) => {
    try {
        const accounts = accountService.getUserAccounts(req.user.id);
        res.status(200).json({ success: true, data: accounts });
    } catch (error) {
        next(error);
    }
};

export const createAccount = (req, res, next) => {
    try {
        const { name, type } = req.body;
        const account = accountService.createAccount(req.user.id, name, type);
        res.status(201).json({ success: true, data: account });
    } catch (error) {
        next(error);
    }
};

export const getAccount = (req, res, next) => {
    try {
        const account = accountService.getAccount(Number(req.params.id), req.user.id);
        res.status(200).json({ success: true, data: account });
    } catch (error) {
        next(error);
    }
};

export const updateAccount = (req, res, next) => {
    try {
        const account = accountService.updateAccount(Number(req.params.id), req.user.id, req.body);
        res.status(200).json({ success: true, data: account });
    } catch (error) {
        next(error);
    }
};

export const deleteAccount = (req, res, next) => {
    try {
        accountService.deleteAccount(Number(req.params.id), req.user.id);
        res.status(200).json({ success: true, message: 'Account deleted' });
    } catch (error) {
        next(error);
    }
};

export const switchAccount = (req, res, next) => {
    try {
        const account = accountService.switchAccount(req.session.token, Number(req.params.id), req.user.id);
        res.status(200).json({ success: true, message: `Switched to account: ${account.name}`, data: account });
    } catch (error) {
        next(error);
    }
};
