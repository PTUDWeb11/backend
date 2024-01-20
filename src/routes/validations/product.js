import { query } from 'express-validator';

export const getProductByCategoryRules = [
	query('category').exists(),
	query('min_price').optional().isNumeric(),
	query('max_price').optional().isNumeric(),
	query('page').optional().isNumeric(),
	query('limit').optional().isNumeric(),
];

export const searchProductRules = [
	query('q').exists(),
	query('min_price').optional().isNumeric(),
	query('max_price').optional().isNumeric(),
	query('page').optional().isNumeric(),
	query('limit').optional().isNumeric(),
];
