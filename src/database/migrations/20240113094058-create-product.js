'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable('products', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
			field: 'id',
		},
		name: {
			allowNull: false,
			type: Sequelize.STRING,
			field: 'name',
		},
		price: {
			allowNull: false,
			type: Sequelize.FLOAT,
			field: 'price',
		},
		description: {
			type: Sequelize.TEXT,
			field: 'description',
		},
		quantity: {
			allowNull: false,
			type: Sequelize.INTEGER,
			field: 'quantity',
		},
		images: {
			type: Sequelize.ARRAY(Sequelize.STRING),
			field: 'images',
		},
		categoryIds: {
			type: Sequelize.ARRAY(Sequelize.INTEGER),
			field: 'category_ids',
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
	await queryInterface.dropTable('products');
}
