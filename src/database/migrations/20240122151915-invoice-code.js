'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	return queryInterface.addColumn('invoices', 'code', {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	});
}
export async function down(queryInterface, Sequelize) {
	return queryInterface.removeColumn('invoices', 'code');
}
