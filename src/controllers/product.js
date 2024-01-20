import createError from 'http-errors';
import db from '@/database';

/**
 * GET /products/main
 * Get main products
 */
export const getMainProducts = async (req, res, next) => {
	try {
		// Find 10 main products
		const products = await db.models.Product.findAll({
			limit: 10,
			order: [['createdAt', 'ASC']],
			include: [
				{
					model: db.models.Category,
					as: 'categories',
				},
			],
		});
		if (!products) {
			return next(createError(400, 'There is no main product in the database!'));
		}

		return res.status(200).json(products);
	} catch (err) {
		return next(err);
	}
};
