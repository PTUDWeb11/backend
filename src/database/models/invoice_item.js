'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
	class InvoiceItem extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	InvoiceItem.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
				field: 'id',
			},
			invoiceId: {
				references: {
					model: 'invoices',
					key: 'id',
				},
				type: DataTypes.INTEGER,
				field: 'invoice_id',
			},
			productId: {
				references: {
					model: 'products',
					key: 'id',
				},
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
			deletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
				field: 'deleted_at',
			},
		},
		{
			sequelize,
			modelName: 'InvoiceItem',
			paranoid: true,
			tableName: 'invoice_items',
		}
	);
	return InvoiceItem;
};
