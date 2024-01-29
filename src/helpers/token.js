import jwt from 'jsonwebtoken';

const { JWT_SECRET_KEY, PAYMENT_SECRET, JWT_EXPIRES_IN } = process.env;

export const generateToken = (data) => {
	const options = {
		expiresIn: JWT_EXPIRES_IN,
	};
	return jwt.sign(data, JWT_SECRET_KEY, options);
};

export const generatePaymentToken = (data) => {
	const options = {
		expiresIn: JWT_EXPIRES_IN,
	};
	return jwt.sign(data, PAYMENT_SECRET, options);
};

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET_KEY);
