import { Sequelize, DataTypes } from 'sequelize';

import * as config from '@/config/sequelize';

// import models
import userModel from './models/user';
import categoryModel from './models/category';
import productModel from './models/product';
import invoiceModel from './models/invoice';
import invoiceItemModel from './models/invoice_item';
import cartItemModel from './models/cart_item';
import productCategoryModel from './models/product_category';

// Configuration
const env = process.env.NODE_ENV;
const sequelizeConfig = config[env];

// Create sequelize instance
const sequelize = new Sequelize(sequelizeConfig);

// Import all model files
const modelDefiners = [
	userModel,
	categoryModel,
	productModel,
	invoiceModel,
	invoiceItemModel,
	cartItemModel,
	productCategoryModel,
];

// eslint-disable-next-line no-restricted-syntax
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize, DataTypes);
}

// Associations
Object.keys(sequelize.models).forEach((modelName) => {
	if (sequelize.models[modelName].associate) {
		sequelize.models[modelName].associate(sequelize.models);
	}
});

export default sequelize;
