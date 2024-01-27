import Response from '@/views';
import db from '@/database';
import * as pagination from '@/helpers/pagination';
import slugify from 'slugify';

/**
 * GET /admin/users/stats
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
 * GET /admin/users
 * Get users
 */
export const getUsers = async (req, res, next) => {
	try {
		const { limit, page } = req.query;
		const { _offset, _limit } = pagination.cal(limit, page);

		const { count, rows: users } = await db.models.User.findAndCountAll({
			offset: _offset,
			limit: _limit,
		});

		return new Response(res).meta(pagination.info(count, _limit, page)).json(users);
	} catch (err) {
		next(err);
	}
};

/**
 * DELETE /admin/users/:user_id
 * Delete user
 */
export const deleteUser = async (req, res, next) => {
	try {
		const { user_id } = req.params;

		// Delete user
		await db.models.User.destroy({
			where: { id: user_id },
		});

		return new Response(res).success();
	} catch (err) {
		next(err);
	}
};

/**
 * GET /admin/products/stats
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
 * GET /admin/products
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
 * POST /admin/products
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
 * GET /admin/products/:product_id
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
 * PUT /admin/products/:product_id
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
 * DELETE /admin/products/:product_id
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

/**
 * GET /admin/categories
 * Get categories
 */
export const getCategories = async (req, res, next) => {
	try {
		const { limit, page } = req.query;
		const { _offset, _limit } = pagination.cal(limit, page);

		const { count, rows: categories } = await db.models.Category.findAndCountAll({
			offset: _offset,
			limit: _limit,
			include: [
				{
					model: db.models.Category,
					as: 'parent',
				},
			],
		});

		return new Response(res).meta(pagination.info(count, _limit, page)).json(categories);
	} catch (err) {
		next(err);
	}
};

/**
 * POST /admin/categories
 * Create category
 */
export const createCategory = async (req, res, next) => {
	try {
		const { name, image, parent_id } = req.body;

		// Create category
		const category = await db.models.Category.create({
			name,
			slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
			image,
			parentId: parent_id,
		});

		return new Response(res).status(201).json(category);
	} catch (err) {
		next(err);
	}
};

/**
 * GET /admin/categories/:category_id
 * Get category
 */
export const getCategory = async (req, res, next) => {
	try {
		const { category_id } = req.params;

		const category = await db.models.Category.findByPk(category_id, {
			include: [
				{
					model: db.models.Category,
					as: 'parent',
				},
			],
		});

		if (!category) {
			return new Response(res).status(404).message('Category not found').json();
		}

		return new Response(res).json(category);
	} catch (err) {
		next(err);
	}
};

/**
 * PATCH /admin/categories/:category_id
 * Update category
 */
export const updateCategory = async (req, res, next) => {
	try {
		const { category_id } = req.params;
		const { name, image } = req.body;

		// Find category
		const category = await db.models.Category.findByPk(category_id);
		if (!category) {
			return new Response(res).status(404).message('Category not found').json();
		}

		// Update category
		await category.update({
			name,
			image,
		});

		return new Response(res).json(category);
	} catch (err) {
		next(err);
	}
};

/**
 * DELETE /admin/categories/:category_id
 * Delete category
 */
export const deleteCategory = async (req, res, next) => {
	try {
		const { category_id } = req.params;

		// Find category
		const category = await db.models.Category.findByPk(category_id);
		if (!category) {
			return new Response(res).status(404).message('Category not found').json();
		}

		// Find child categories
		const childCategories = await db.models.Category.findAll({
			where: { parent_id: category_id },
		});

		// Transaction
		await db.transaction(async (t) => {
			// Delete category
			await category.destroy({ transaction: t });

			// Delete child categories
			await Promise.all(childCategories.map((childCategory) => childCategory.destroy({ transaction: t })));

			// Delete product categories of those categories
			await db.models.ProductCategory.destroy({
				where: { categoryId: [...childCategories.map((childCategory) => childCategory.id), category_id] },
				transaction: t,
			});
		});

		return new Response(res).success();
	} catch (err) {
		next(err);
	}
};

/**
 * GET /admin/invoices
 * Get invoices
 */
export const getInvoices = async (req, res, next) => {
	try {
		const { limit, page } = req.query;
		const { _offset, _limit } = pagination.cal(limit, page);

		const { count, rows: invoices } = await db.models.Invoice.findAndCountAll({
			offset: _offset,
			limit: _limit,
			include: [
				{
					model: db.models.User,
					as: 'user',
				},
			],
		});

		return new Response(res).meta(pagination.info(count, _limit, page)).json(invoices);
	} catch (err) {
		next(err);
	}
};

/**
 * GET /admin/invoices/:invoice_id
 * Get invoice
 */
export const getInvoice = async (req, res, next) => {
	try {
		const { invoice_id } = req.params;

		const invoice = await db.models.Invoice.findByPk(invoice_id, {
			include: [
				{
					model: db.models.User,
					as: 'user',
				},
				{
					model: db.models.InvoiceItem,
					as: 'items',
					include: [
						{
							model: db.models.Product,
							as: 'product',
						},
					],
				},
			],
		});

		if (!invoice) {
			return new Response(res).status(404).message('Invoice not found').json();
		}

		return new Response(res).json(invoice);
	} catch (err) {
		next(err);
	}
};

/**
 * PATCH /admin/invoices/:invoice_id
 * Update invoice
 */
export const updateInvoice = async (req, res, next) => {
	try {
		const { invoice_id } = req.params;
		const { status } = req.body;

		// Find invoice
		const invoice = await db.models.Invoice.findByPk(invoice_id);
		if (!invoice) {
			return new Response(res).status(404).message('Invoice not found').json();
		}

		// Update invoice
		await invoice.update({ status });

		return new Response(res).json(invoice);
	} catch (err) {
		next(err);
	}
};
