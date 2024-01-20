import authRouter from '@/routes/auth';
import indexRouter from '@/routes/index';
import categoryRouter from '@/routes/category';
import productRouter from '@/routes/product';

export default function (app) {
	app.use('/', indexRouter);
	app.use('/auth', authRouter);
	app.use('/categories', categoryRouter);
	app.use('/products', productRouter);
}
