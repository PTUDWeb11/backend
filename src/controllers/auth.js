import createError from 'http-errors';
import { OAuth2Client } from 'google-auth-library';
import db from '@/database';
import { googleConfig } from '@/config';
import md5 from 'md5';

const client = new OAuth2Client({
	clientId: googleConfig.clientID,
	clientSecret: googleConfig.clientSecret,
	redirectUri: googleConfig.callbackURL,
});

/**
 * POST /auth/login
 * Login request
 */
export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Find user by email address
		const user = await db.models.User.findOne({ where: { email } });
		if (!user) {
			return next(
				createError(400, 'There is no user with this email address!')
			);
		}

		if (user.provider === 'google') {
			return next(createError(400, 'Please login with Google!'));
		}

		// Check user password
		const isValidPassword = await user.validatePassword(password);
		if (!isValidPassword) {
			return next(createError(400, 'Incorrect password!'));
		}

		// Generate and return token
		const token = user.generateToken();
		const refreshToken = user.generateToken('2h');
		return res.status(200).json({ token, refreshToken });
	} catch (err) {
		return next(err);
	}
};

/**
 * POST /auth/register
 * Register request
 */
export const register = async (req, res, next) => {
	try {
		// Check if user exists
		const userExists = await db.models.User.findOne({
			where: { email: req.body.email },
		});

		if (userExists) {
			return next(createError(400, 'User already exists!'));
		}

		// Create user
		const user = await db.models.User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			provider: 'email',
			avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${md5(
				req.body.email,
				10
			)}`,
		});

		// Generate and return tokens
		const token = user.generateToken();
		const refreshToken = user.generateToken('2h');
		res.status(201).json({ token, refreshToken });
	} catch (err) {
		next(err);
	}
};

export const googleAuth = async (req, res, next) => {
	try {
		const { code, redirectUri } = req.body;
		const userInfo = await verifyCode(code, redirectUri);
		const user = await db.models.User.findOne({
			where: { email: userInfo.email },
		});

		if (!user) {
			const newUser = await db.models.User.create({
				name: userInfo.name,
				email: userInfo.email,
				password: '',
				provider: 'google',
				socialId: userInfo.sub,
				avatar: userInfo.picture,
			});

			const token = newUser.generateToken();
			const refreshToken = newUser.generateToken('2h');
			return res.status(201).json({ token, refreshToken });
		}

		const token = user.generateToken();
		const refreshToken = user.generateToken('2h');
		return res.status(200).json({ token, refreshToken });
	} catch (err) {
		next(err);
	}
};
/**
 * GET /auth/me
 * Get current user
 */
export const getCurrentUser = async (req, res, next) => {
	try {
		delete req.user.dataValues.password;
		res.json(req.user);
	} catch (err) {
		next(err);
	}
};

/**
 * PUT /auth/me
 * Update current user
 */
export const updateCurrentUser = async (req, res, next) => {
	try {
		await req.user.update(req.body, {
			fields: ['firstName', 'lastName', 'email'],
		});
		res.status(200).json({ success: true });
	} catch (err) {
		next(err);
	}
};

/**
 * DELETE /auth/me
 * Delete current user
 */
export const deleteCurrentUser = async (req, res, next) => {
	try {
		await req.user.destroy();
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};

/**
 * PUT /auth/me/password
 * Update password of current user
 */
export const updatePassword = async (req, res, next) => {
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

		return res.json({ success: true });
	} catch (err) {
		return next(err);
	}
};

// Call this function to validate OAuth2 authorization code sent from client-side
async function verifyCode(code, redirectUri) {
	let { tokens } = await client.getToken(code);
	client.setCredentials({ access_token: tokens.access_token });
	client.redirectUri = redirectUri;
	const userinfo = await client.request({
		url: 'https://www.googleapis.com/oauth2/v3/userinfo',
	});
	return userinfo.data;
}
