import createError from 'http-errors';
import db from '@/database';
import * as pagination from '@/helpers/pagination';

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

/**
 * GET /products?category=slug&page=1&limit=10&min_price=100&max_price=1000
 * Get products by category
 */
export const getProductsByCategory = async (req, res, next) => {
	try {
		const { category, page, limit, min_price, max_price } = req.query;
		const { _offset, _limit } = pagination.cal(limit, page);

		// Find products by category
		const { count, rows: products } = await db.models.Product.findAndCountAll({
			limit: _limit,
			offset: _offset,
			where: {
				price: {
					[db.Sequelize.Op.between]: [min_price || 0, max_price || 999999999],
				},
			},
			order: [['createdAt', 'ASC']],
			include: [
				{
					model: db.models.Category,
					as: 'categories',
					where: { slug: category },
				},
			],
		});
		if (!products) {
			return next(createError(400, 'There is no product in the database!'));
		}

		return res.status(200).json({
			meta: pagination.info(count, _limit, page),
			products,
		});
	} catch (err) {
		return next(err);
	}
};
