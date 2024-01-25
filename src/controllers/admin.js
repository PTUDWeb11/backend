import Response from '@/views';
import db from '@/database';
import * as pagination from '@/helpers/pagination';
import slugify from 'slugify';

/**
 * GET /users/stats
 * Get user stats
 */
export const getUserStats = async (req, res, next) => {
	try {
		const total = await db.models.User.count();
		const stats = await db.models.User.findAll({
			attributes: [
				[db.fn('DATE', db.col('created_at')), 'date'],
				[db.fn('COUNT', db.col('id')), 'count'],
			],
			group: [db.fn('DATE', db.col('created_at'))],
		});

		return new Response(res).json({ total, stats });
	} catch (err) {
		next(err);
	}
};

/**
 * GET /products/stats
 * Get product stats
 */
export const getProductStats = async (req, res, next) => {
	try {
		const total = await db.models.Product.count();
		const stats = await db.models.Product.findAll({
			attributes: [
				[db.fn('DATE', db.col('created_at')), 'date'],
				[db.fn('COUNT', db.col('id')), 'count'],
			],
			group: [db.fn('DATE', db.col('created_at'))],
		});

		return new Response(res).json({ total, stats });
	} catch (err) {
		next(err);
	}
};

/**
 * GET /products
 * Get products
 */
export const getProducts = async (req, res, next) => {
	try {
		const { limit, page } = req.query;
		const { _offset, _limit } = pagination.cal(limit, page);

		const { count, rows: products } = await db.models.Product.findAndCountAll({
			offset: _offset,
			limit: _limit,
			include: [
				{
					model: db.models.Category,
					as: 'categories',
				},
			],
		});

		return new Response(res).meta(pagination.info(count, _limit, page)).json(products);
	} catch (err) {
		next(err);
	}
};

/**
 * POST /products
 * Create product
 */
export const createProduct = async (req, res, next) => {
	try {
		const { name, description, price, quantity, categories, images } = req.body;

		// Transaction
		const product = await db.transaction(async (t) => {
			// Create product
			const product = await db.models.Product.create(
				{
					name,
					slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
					description,
					price,
					quantity,
					images,
				},
				{ transaction: t }
			);

			// Add categories to product
			await product.setCategories(categories, { transaction: t });

			return product;
		});

		return new Response(res).status(201).json(product);
	} catch (err) {
		next(err);
	}
};

/**
 * GET /products/:product_id
 * Get product
 */
export const getProduct = async (req, res, next) => {
	try {
		const { product_id } = req.params;

		const product = await db.models.Product.findByPk(product_id, {
			include: [
				{
					model: db.models.Category,
					as: 'categories',
				},
			],
		});

		if (!product) {
			return new Response(res).status(404).message('Product not found').json();
		}

		return new Response(res).json(product);
	} catch (err) {
		next(err);
	}
};

/**
 * PUT /products/:product_id
 * Update product
 */
export const updateProduct = async (req, res, next) => {
	try {
		const { product_id } = req.params;
		const { name, description, price, quantity, categories, images } = req.body;

		// Find product
		const product = await db.models.Product.findByPk(product_id);
		if (!product) {
			return new Response(res).status(404).message('Product not found').json();
		}

		// Transaction
		const newProduct = await db.transaction(async (t) => {
			// Update product
			await product.update(
				{
					name,
					slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
					description,
					price,
					quantity,
					images,
				},
				{ transaction: t }
			);

			// Add categories to product
			await product.setCategories(categories, { transaction: t });

			return product;
		});

		return new Response(res).json(newProduct);
	} catch (err) {
		next(err);
	}
};

/**
 * DELETE /products/:product_id
 * Delete product
 */
export const deleteProduct = async (req, res, next) => {
	try {
		const { product_id } = req.params;

		// Delete product
		await db.models.Product.destroy({
			where: { id: product_id },
		});

		return new Response(res).success();
	} catch (err) {
		next(err);
	}
};
