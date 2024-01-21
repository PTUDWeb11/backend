import { body } from 'express-validator';

export const updateUserProfileRules = [body('name').optional(), body('address').optional()];

export const changePasswordRules = [body('current').exists(), body('password').isLength({ min: 6 }).exists()];
