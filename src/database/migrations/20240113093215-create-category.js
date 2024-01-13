'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('categories', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
				field: 'id',
			},
			parentId: {
				references: { model: 'categories', key: 'id' },
				type: Sequelize.INTEGER,
				field: 'parent_id',
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
				field: 'name',
			},
			image: {
				type: Sequelize.STRING,
				field: 'image',
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
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('categories');
	},
};
