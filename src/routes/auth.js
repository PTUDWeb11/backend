import { Router } from 'express';

import * as authController from '@/controllers/auth';
import * as authValidations from '@/routes/validations/auth';
import { validate } from '@/middlewares';

const router = Router();

router.post('/login', validate(authValidations.loginRules), authController.login);

router.post('/register', validate(authValidations.registerRules), authController.register);

router.post('/google', validate(authValidations.googleAuthRules), authController.googleAuth);

export default router;
