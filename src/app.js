import 'dotenv/config';

import cors from 'cors';
import logger from 'morgan';
import express from 'express';
import compression from 'compression';
import createError from 'http-errors';

import * as configs from '@/config';
import { authenticationMiddleware } from '@/middlewares';

const app = express();

// Required middleware list
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(configs.corsConfig));
app.use(compression(configs.compressionConfig));

// Custom middleware list
app.use(authenticationMiddleware);

// Load router paths
configs.routerConfig(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	console.log(err);
	res.status(err.status || 500).json(err);
});

export default app;
