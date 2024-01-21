import createError from 'http-errors';
import Response from '@/views';
import db from '@/database';

/**
 * GET /user/profile
 * Get user profile
 */
export const getUserProfile = async (req, res, next) => {
	try {
		delete req.user.dataValues.password;

		return new Response(res).status(200).json(req.user);
	} catch (err) {
		next(err);
	}
};

/**
 * PATCH /user/profile
 * Update user profile
 */
export const updateUserProfile = async (req, res, next) => {
	try {
		await req.user.update(req.body, {
			fields: ['name', 'address'],
		});

		return new Response(res).success();
	} catch (err) {
		next(err);
	}
};

/**
 * PATCH /user/password
 * Change user password
 */
export const changePassword = async (req, res, next) => {
	try {
		const { current, password } = req.body;

		// Check user password
		const isValidPassword = await req.user.validatePassword(current);
		if (!isValidPassword) {
			return next(createError(400, 'Incorrect password!'));
		}

		// Update password
		req.user.password = password;
		await req.user.save();

		return new Response(res).success();
	} catch (err) {
		return next(err);
	}
};

/**
 * GET /user/items
 * Get user cart items
 */
export const getUserCartItems = async (req, res, next) => {
	try {
		const items = await db.models.CartItem.findAll({
			where: { user_id: req.user.id },
			include: [
				{
					model: db.models.Product,
					as: 'product',
				},
			],
		});

		return new Response(res).status(200).json(items);
	} catch (err) {
		next(err);
	}
};

/**
 * POST /user/items
 * Add item to cart
 */
export const addCartItem = async (req, res, next) => {
	try {
		const { product_id, quantity } = req.body;

		// Find product by id
		const product = await db.models.Product.findByPk(product_id);
		if (!product || product.quantity <= 0) {
			return next(createError(400, 'There is no product in the database!'));
		}

		// Check if the product is already in the cart
		const item = await db.models.CartItem.findOne({
			where: { product_id, user_id: req.user.id },
		});

		// If the product is already in the cart, update the quantity
		if (item) {
			// Check if the quantity is greater than the product quantity
			if (item.quantity + quantity > product.quantity) {
				return next(createError(400, 'There is no enough product in the stock!'));
			}

			item.quantity += quantity;
			await item.save();
		} else {
			// Check if the quantity is greater than the product quantity
			if (quantity > product.quantity) {
				return next(createError(400, 'There is no enough product in the stock!'));
			}

			// If the product is not in the cart, add it
			await db.models.CartItem.create({
				productId: product_id,
				userId: req.user.id,
				quantity,
			});
		}

		return new Response(res).success();
	} catch (err) {
		next(err);
	}
};

/**
 * PATCH /user/items/:item_id
 * Update cart item
 */
export const updateCartItem = async (req, res, next) => {
	try {
		const { item_id } = req.params;
		const { quantity } = req.body;

		// Find cart item by id
		const item = await db.models.CartItem.findByPk(item_id, {
			include: [
				{
					model: db.models.Product,
					as: 'product',
				},
			],
		});
		if (!item) {
			return next(createError(400, 'There is no item in the database!'));
		}

		// Check if the quantity is greater than the product quantity
		if (quantity > item.product.quantity) {
			return next(createError(400, 'There is no enough product in the stock!'));
		}

		if (quantity <= 0) {
			await item.destroy();
		} else {
			item.quantity = quantity;
			await item.save();
		}

		return new Response(res).success();
	} catch (err) {
		next(err);
	}
};

/**
 * DELETE /user/items/:item_id
 * Delete cart item
 */
export const deleteCartItem = async (req, res, next) => {
	try {
		const { item_id } = req.params;

		// Find cart item by id
		const item = await db.models.CartItem.findByPk(item_id);
		if (!item) {
			return next(createError(400, 'There is no item in the database!'));
		}

		await item.destroy();

		return new Response(res).success();
	} catch (err) {
		next(err);
	}
};
