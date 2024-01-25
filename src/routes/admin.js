import { Router } from 'express';

import * as adminController from '@/controllers/admin';
import * as adminValidations from '@/routes/validations/admin';
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

		productRouter
			.route('/')
			.get(validate(adminValidations.getProductsRules), adminController.getProducts)
			.post(validate(adminValidations.createProductRules), adminController.createProduct);

		productRouter
			.route('/:product_id')
			.get(validate(adminValidations.getProductRules), adminController.getProduct)
			.put(validate(adminValidations.updateProductRules), adminController.updateProduct)
			.delete(validate(adminValidations.deleteProductRules), adminController.deleteProduct);

		return productRouter;
	})()
);

export default router;
