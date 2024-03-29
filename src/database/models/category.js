'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
	class Category extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Category.hasMany(models.Category, {
				foreignKey: 'parentId',
				as: 'children',
			});

			Category.belongsTo(models.Category, {
				foreignKey: 'parentId',
				as: 'parent',
			});

			Category.belongsToMany(models.Product, {
				through: 'ProductCategory',
				foreignKey: 'categoryId',
				as: 'products',
			});
		}
	}
	Category.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
				field: 'id',
			},
			parentId: {
				references: { model: 'categories', key: 'id' },
				type: DataTypes.INTEGER,
				field: 'parent_id',
			},
			name: {
				allowNull: false,
				type: DataTypes.STRING,
				field: 'name',
			},
			slug: {
				allowNull: false,
				unique: true,
				type: DataTypes.STRING,
				field: 'slug',
			},
			image: {
				type: DataTypes.STRING,
				field: 'image',
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
			modelName: 'Category',
			paranoid: true,
			tableName: 'categories',
		}
	);
	return Category;
};
