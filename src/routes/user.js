import { Router } from 'express';

import * as userController from '@/controllers/user';
import * as userValidations from '@/routes/validations/user';
import { isAuthenticated, validate } from '@/middlewares';

const router = Router();

router
	.route('/profile')
	.get(isAuthenticated, userController.getUserProfile)
	.patch(isAuthenticated, validate(userValidations.updateUserProfileRules), userController.updateUserProfile);

router.patch(
	'/password',
	isAuthenticated,
	validate(userValidations.changePasswordRules),
	userController.changePassword
);

export default router;
