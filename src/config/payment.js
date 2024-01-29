import 'dotenv/config';

export default {
	endPoint: process.env.PAYMENT_ENDPOINT,
	secret: process.env.PAYMENT_SECRET,
	callbackUrl: process.env.PAYMENT_CALLBACK_URL,
};
