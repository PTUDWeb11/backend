'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	return queryInterface.sequelize.transaction(async (t) => {
		return Promise.all([
			queryInterface.addColumn('invoice_items', 'price_per_unit', {
				type: Sequelize.FLOAT,
				allowNull: false,
			}),
			queryInterface.addColumn('invoices', 'total_price', {
				type: Sequelize.FLOAT,
				allowNull: false,
			}),
		]);
	});
}
export async function down(queryInterface, Sequelize) {
	return queryInterface.sequelize.transaction(async (t) => {
		return Promise.all([
			queryInterface.removeColumn('invoice_items', 'price_per_unit'),
			queryInterface.removeColumn('invoices', 'total_price'),
		]);
	});
}
