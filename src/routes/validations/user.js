import { body } from 'express-validator';

export const updateUserProfileRules = [body('name').optional(), body('address').optional()];

export const changePasswordRules = [body('current').exists(), body('password').isLength({ min: 6 }).exists()];

export const addCartItemRules = [body('product_id').isInt().exists(), body('quantity').isInt().exists()];

export const updateCartItemRules = [body('quantity').isInt().exists()];
