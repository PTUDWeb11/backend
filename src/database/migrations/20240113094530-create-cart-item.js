'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable('cart_items', {
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
		productId: {
			references: { model: 'products', key: 'id' },
			type: Sequelize.INTEGER,
			field: 'product_id',
		},
		quantity: {
			allowNull: false,
			type: Sequelize.INTEGER,
			field: 'quantity',
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
	});
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.dropTable('cart_items');
}
