'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
	class ProductCategory extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {}
	}
	ProductCategory.init(
		{
			productId: {
				references: { model: 'products', key: 'id' },
				type: DataTypes.INTEGER,
				primaryKey: true,
				field: 'product_id',
			},
			categoryId: {
				references: { model: 'categories', key: 'id' },
				type: DataTypes.INTEGER,
				primaryKey: true,
				field: 'category_id',
			},
		},
		{
			sequelize,
			modelName: 'ProductCategory',
			timestamps: false,
			tableName: 'product_categories',
		}
	);
	return ProductCategory;
};
