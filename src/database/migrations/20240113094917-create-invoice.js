'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable('invoices', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
			field: 'id',
		},
		userId: {
			references: { model: 'users', key: 'id' },
			type: Sequelize.INTEGER,
			field: 'user_id',
		},
		status: {
			type: Sequelize.ENUM(
				'paying',
				'processing',
				'delivering',
				'delivered',
				'canceled'
			),
		},
		createdAt: {
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			type: Sequelize.DATE,
			field: 'created_at',
		},
		updatedAt: {
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			type: Sequelize.DATE,
			field: 'updated_at',
		},
		deletedAt: {
			allowNull: true,
			type: Sequelize.DATE,
			field: 'deleted_at',
		},
	});
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.dropTable('invoices');
}
