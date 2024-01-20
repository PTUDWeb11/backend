import { Router } from 'express';

import * as categoryController from '@/controllers/category';

const router = Router();

router.get('/main', categoryController.getMainCategories);

export default router;
