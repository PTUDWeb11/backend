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

		userRouter.get('/', validate(adminValidations.getUsersRules), adminController.getUsers);

		userRouter.delete('/:user_id', validate(adminValidations.deleteUserRules), adminController.deleteUser);

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

router.use(
	'/categories',
	(function () {
		const categoryRouter = Router();

		categoryRouter
			.route('/')
			.get(validate(adminValidations.getCategoriesRules), adminController.getCategories)
			.post(validate(adminValidations.createCategoryRules), adminController.createCategory);

		categoryRouter
			.route('/:category_id')
			.get(validate(adminValidations.getCategoryRules), adminController.getCategory)
			.patch(validate(adminValidations.updateCategoryRules), adminController.updateCategory)
			.delete(validate(adminValidations.deleteCategoryRules), adminController.deleteCategory);

		return categoryRouter;
	})()
);

router.use(
	'/invoices',
	(function () {
		const invoiceRouter = Router();

		invoiceRouter.get('/', validate(adminValidations.getInvoicesRules), adminController.getInvoices);

		invoiceRouter
			.route('/:invoice_id')
			.get(validate(adminValidations.getInvoiceRules), adminController.getInvoice)
			.patch(validate(adminValidations.updateInvoiceRules), adminController.updateInvoice);

		return invoiceRouter;
	})()
);

export default router;
