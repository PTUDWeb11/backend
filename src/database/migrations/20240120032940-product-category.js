'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// drop column categoryIds from products table
		await queryInterface.removeColumn('products', 'category_ids');

		// create table product_categories
		await queryInterface.createTable('product_categories', {
			productId: {
				references: { model: 'products', key: 'id' },
				type: Sequelize.INTEGER,
				primaryKey: true,
				field: 'product_id',
			},
			categoryId: {
				references: { model: 'categories', key: 'id' },
				type: Sequelize.INTEGER,
				primaryKey: true,
				field: 'category_id',
			},
		});
	},

	async down(queryInterface, Sequelize) {
		// drop table product_categories
		await queryInterface.dropTable('product_categories');

		// add column categoryIds to products table
		await queryInterface.addColumn('products', 'category_ids', {
			type: Sequelize.ARRAY(Sequelize.INTEGER),
			allowNull: true,
		});
	},
};
