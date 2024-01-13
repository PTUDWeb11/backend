import 'dotenv/config';

const {
	PG_HOST,
	PG_PORT = 5432,
	PG_DATABASE,
	PG_USER,
	PG_PASSWORD,
} = process.env;

const defaultConfig = {
	dialect: 'postgres',
	timezone: '+07:00',
	username: PG_USER,
	password: PG_PASSWORD,
	database: PG_DATABASE,
	host: PG_HOST,
	port: Number(PG_PORT),
	define: {
		paranoid: true,
	},
};

export const development = {
	...defaultConfig,
};
