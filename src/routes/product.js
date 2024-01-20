import { Router } from 'express';

import * as productController from '@/controllers/product';
import * as productValidations from '@/routes/validations/product';
import { validate } from '@/middlewares';

const router = Router();

router.get('/main', productController.getMainProducts);

router.get('/', validate(productValidations.getProductByCategoryRules), productController.getProductsByCategory);

router.get('/search', validate(productValidations.searchProductRules), productController.searchProducts);

export default router;
