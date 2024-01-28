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
			return next(createError(400, 'There is no user with this email address!'));
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
		const refreshToken = user.generateToken();
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
			avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${md5(req.body.email, 10)}`,
		});

		// Generate and return tokens
		const token = user.generateToken();
		const refreshToken = user.generateToken();
		res.status(201).json({ token, refreshToken });
	} catch (err) {
		next(err);
	}
};

export const googleAuth = async (req, res, next) => {
	try {
		const { code, redirectUri } = req.body;

		console.log('redirectUri: ', redirectUri);

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
			const refreshToken = newUser.generateToken();
			return res.status(201).json({ token, refreshToken });
		}

		const token = user.generateToken();
		const refreshToken = user.generateToken();
		return res.status(200).json({ token, refreshToken });
	} catch (err) {
		next(err);
	}
};

// Call this function to validate OAuth2 authorization code sent from client-side
async function verifyCode(code, redirectUri) {
	let { tokens } = await client.getToken(code);
	client.setCredentials({ access_token: tokens.access_token });

	console.log('redirectUri: ', redirectUri);

	client.redirectUri = redirectUri;
	const userinfo = await client.request({
		url: 'https://www.googleapis.com/oauth2/v3/userinfo',
	});
	return userinfo.data;
}
