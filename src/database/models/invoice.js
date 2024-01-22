'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
	class Invoice extends Model {
		static associate(models) {
			this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
			this.hasMany(models.InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
		}
	}
	Invoice.init(
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
			status: {
				type: DataTypes.ENUM('paying', 'processing', 'delivering', 'delivered', 'canceled'),
			},
			totalPrice: {
				allowNull: false,
				type: DataTypes.FLOAT,
				field: 'total_price',
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
			modelName: 'Invoice',
			paranoid: true,
			tableName: 'invoices',
		}
	);
	return Invoice;
};
