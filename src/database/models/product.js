'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
	class Product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Product.belongsToMany(models.Category, {
				through: 'ProductCategory',
				foreignKey: 'productId',
				as: 'categories',
			});
		}
	}
	Product.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
				field: 'id',
			},
			name: {
				allowNull: false,
				type: DataTypes.STRING,
				field: 'name',
			},
			price: {
				allowNull: false,
				type: DataTypes.FLOAT,
				field: 'price',
			},
			description: {
				type: DataTypes.TEXT,
				field: 'description',
			},
			quantity: {
				allowNull: false,
				type: DataTypes.INTEGER,
				field: 'quantity',
			},
			images: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				field: 'images',
			},
			createdAt: {
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
				type: DataTypes.DATE,
				field: 'created_at',
			},
			updatedAt: {
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
				type: DataTypes.DATE,
				field: 'updated_at',
			},
			deletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
				field: 'deleted_at',
			},
		},
		{
			sequelize,
			modelName: 'Product',
			paranoid: true,
			tableName: 'products',
		}
	);
	return Product;
};
