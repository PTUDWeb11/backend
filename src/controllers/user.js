import createError from 'http-errors';
import Response from '@/views';

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
