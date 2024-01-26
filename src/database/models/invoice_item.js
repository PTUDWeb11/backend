'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
	class InvoiceItem extends Model {
		static associate(models) {
			this.belongsTo(models.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
			this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
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
			pricePerUnit: {
				allowNull: false,
				type: DataTypes.FLOAT,
				field: 'price_per_unit',
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
