import 'dotenv/config';

const { PG_HOST, PG_PORT = 5432, PG_DATABASE, PG_USER, PG_PASSWORD, PG_SSL = 'false' } = process.env;

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

if (PG_SSL == 'true') {
	defaultConfig.dialectOptions = {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	};
}

export const development = {
	...defaultConfig,
};
