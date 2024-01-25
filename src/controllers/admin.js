import Response from '@/views';
import db from '@/database';

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
