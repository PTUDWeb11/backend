import createError from 'http-errors';
import db from '@/database';
import * as pagination from '@/helpers/pagination';
import Response from '@/views';

/**
 * GET /products/main
 * Get main products
 */
export const getMainProducts = async (req, res, next) => {
	try {
		// Find 20 main products
		const products = await db.models.Product.findAll({
			limit: 20,
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

		return new Response(res).status(200).json(products);
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
			distinct: true,
			where: {
				price: {
					[db.Sequelize.Op.between]: [Number.parseInt(min_price) || 0, Number.parseInt(max_price) || 999999999],
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

		return new Response(res).status(200).meta(pagination.info(count, _limit, page)).json(products);
	} catch (err) {
		return next(err);
	}
};

/**
 * GET /products/search?q=iphone&page=1&limit=10&min_price=100&max_price=1000
 * Search products by keyword
 */
export const searchProducts = async (req, res, next) => {
	try {
		const { q, page, limit, min_price, max_price } = req.query;
		const { _offset, _limit } = pagination.cal(limit, page);

		// Find products by category
		const { count, rows: products } = await db.models.Product.findAndCountAll({
			limit: _limit,
			offset: _offset,
			distinct: true,
			where: {
				search_vector: db.Sequelize.literal(`search_vector @@ plainto_tsquery('english', '${q}')`),
				price: {
					[db.Sequelize.Op.between]: [Number.parseInt(min_price) || 0, Number.parseInt(max_price) || 999999999],
				},
			},
			order: [
				[db.Sequelize.literal(`ts_rank('search_vector', plainto_tsquery('english', '${q}'))`), 'DESC'],
				['createdAt', 'ASC'],
			],
			include: [
				{
					model: db.models.Category,
					as: 'categories',
				},
			],
		});
		if (!products) {
			return next(createError(400, 'There is no product in the database!'));
		}

		return new Response(res).status(200).meta(pagination.info(count, _limit, page)).json(products);
	} catch (err) {
		return next(err);
	}
};

/**
 * GET /products/:product_slug
 * Get product by slug
 */

export const getProductBySlug = async (req, res, next) => {
	try {
		const { product_slug } = req.params;

		// Find product by slug
		const product = await db.models.Product.findOne({
			where: { slug: product_slug },
			include: [
				{
					model: db.models.Category,
					as: 'categories',
				},
			],
		});
		if (!product) {
			return next(createError(400, 'There is no product in the database!'));
		}

		return new Response(res).status(200).json(product);
	} catch (err) {
		return next(err);
	}
};

/**
 * GET /products/:product_slug/related
 * Get related products
 */

export const getRelatedProducts = async (req, res, next) => {
	try {
		const { product_slug } = req.params;

		// Find product by slug
		const product = await db.models.Product.findOne({
			where: { slug: product_slug },
			include: [
				{
					model: db.models.Category,
					as: 'categories',
				},
			],
		});
		if (!product) {
			return next(createError(400, 'There is no product in the database!'));
		}

		// Find related products
		const relatedProducts = await db.models.Product.findAll({
			where: {
				id: {
					[db.Sequelize.Op.ne]: product.id,
				},
			},
			limit: 10,
			order: [['createdAt', 'ASC']],
			include: [
				{
					model: db.models.Category,
					as: 'categories',
					where: { id: { [db.Sequelize.Op.in]: product.categories.map((category) => category.id) } },
				},
			],
		});
		if (!relatedProducts) {
			return next(createError(400, 'There is no related product in the database!'));
		}

		return new Response(res).status(200).json(relatedProducts);
	} catch (err) {
		return next(err);
	}
};
