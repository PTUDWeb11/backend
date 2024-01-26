import { body, query, param } from 'express-validator';

export const getProductsRules = [query('page').optional().isNumeric(), query('limit').optional().isNumeric()];

export const createProductRules = [
	body('name').exists().isString().isLength({ min: 3, max: 255 }),
	body('description').exists().isString().isLength({ min: 3 }),
	body('price').exists().isNumeric(),
	body('quantity').exists().isInt(),
	body('categories').exists().isArray(),
	body('categories.*').isInt(),
	body('images').exists().isArray(),
	body('images.*').isURL(),
];

export const getProductRules = [param('product_id').exists().isInt()];

export const updateProductRules = [
	param('product_id').exists().isInt(),
	body('name').optional().isString().isLength({ min: 3, max: 255 }),
	body('description').optional().isString().isLength({ min: 3 }),
	body('price').optional().isNumeric(),
	body('quantity').optional().isInt(),
	body('categories').optional().isArray(),
	body('categories.*').isInt(),
	body('images').optional().isArray(),
	body('images.*').isURL(),
];

export const deleteProductRules = [param('product_id').exists().isInt()];

export const getCategoriesRules = [query('page').optional().isNumeric(), query('limit').optional().isNumeric()];

export const createCategoryRules = [
	body('name').exists().isString().isLength({ min: 3, max: 255 }),
	body('image').optional().isURL(),
];

export const getCategoryRules = [param('category_id').exists().isInt()];

export const updateCategoryRules = [
	param('category_id').exists().isInt(),
	body('name').optional().isString().isLength({ min: 3, max: 255 }),
	body('image').optional().isURL(),
];

export const deleteCategoryRules = [param('category_id').exists().isInt()];
