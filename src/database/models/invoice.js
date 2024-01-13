'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
	class Invoice extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
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
				type: DataTypes.ENUM(
					'paying',
					'processing',
					'delivering',
					'delivered',
					'canceled'
				),
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
