'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.addIndex('cart_items', ['user_id', 'product_id'], {
		unique: true,
	});
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.removeIndex('cart_items', ['user_id', 'product_id']);
}
