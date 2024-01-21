import { body } from 'express-validator';

export const loginRules = [body('email').isEmail().exists(), body('password').exists()];

export const registerRules = [
	body('name').exists(),
	body('address').optional(),
	body('email').isEmail().exists(),
	body('password').isLength({ min: 6 }).exists(),
];

export const googleAuthRules = [body('code').exists(), body('redirectUri').exists()];
