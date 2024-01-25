import { Router } from 'express';

import * as adminController from '@/controllers/admin';
// import * as adminValidations from '@/routes/validations/admin';
import { isAuthorized, validate } from '@/middlewares';

const router = Router();

router.use(isAuthorized);

router.use(
	'/users',
	(function () {
		const userRouter = Router();

		userRouter.get('/stats', adminController.getUserStats);

		return userRouter;
	})()
);

router.use(
	'/products',
	(function () {
		const productRouter = Router();

		productRouter.get('/stats', adminController.getProductStats);

		return productRouter;
	})()
);

export default router;
