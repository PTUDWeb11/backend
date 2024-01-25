import createError from 'http-errors';

export async function isAuthenticated(req, res, next) {
	if (!req.user) {
		const error = createError(401, 'Not authenticated!');
		return next(error);
	}
	return next();
}

export async function isAuthorized(req, res, next) {
	if (!req.user) {
		const error = createError(401, 'Not authenticated!');
		return next(error);
	}

	if (!req.user.isAdmin) {
		const error = createError(403, 'Not authorized!');
		return next(error);
	}

	return next();
}
