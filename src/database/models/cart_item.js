'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
	class CartItem extends Model {
		static associate(models) {
			this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
			this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
		}
	}
	CartItem.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
				field: 'id',
			},
			userId: {
				references: { model: 'users', key: 'id' },
				type: DataTypes.INTEGER,
				field: 'user_id',
			},
			productId: {
				references: { model: 'products', key: 'id' },
				type: DataTypes.INTEGER,
				field: 'product_id',
			},
			quantity: {
				allowNull: false,
				type: DataTypes.INTEGER,
				field: 'quantity',
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
		},
		{
			sequelize,
			modelName: 'CartItem',
			paranoid: false,
			tableName: 'cart_items',
		}
	);
	return CartItem;
};
