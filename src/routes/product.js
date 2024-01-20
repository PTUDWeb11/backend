import { Router } from 'express';

import * as productController from '@/controllers/product';

const router = Router();

router.get('/main', productController.getMainProducts);

export default router;
