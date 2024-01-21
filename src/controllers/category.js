import createError from 'http-errors';
import db from '@/database';
import Response from '@/views';

/**
 * GET /categories/main
 * Get main categories
 */
export const getMainCategories = async (req, res, next) => {
	try {
		// Find 10 main categories, maximum 3 levels
		const categories = await db.models.Category.findAll({
			where: { parentId: null },
			order: [['createdAt', 'ASC']],
			include: [
				{
					model: db.models.Category,
					as: 'children',
					include: [
						{
							model: db.models.Category,
							as: 'children',
						},
					],
				},
			],
		});
		if (!categories) {
			return next(createError(400, 'There is no main category in the database!'));
		}

		return new Response(res).status(200).json(categories);
	} catch (err) {
		return next(err);
	}
};
