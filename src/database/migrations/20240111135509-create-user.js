'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
				field: 'id',
			},
			email: {
				unique: true,
				allowNull: false,
				type: Sequelize.STRING,
				field: 'email',
			},
			password: {
				type: Sequelize.STRING,
				field: 'password',
			},
			provider: {
				allowNull: false,
				type: Sequelize.STRING,
				field: 'provider',
			},
			socialId: {
				type: Sequelize.STRING,
				field: 'social_id',
			},
			name: {
				type: Sequelize.STRING,
				field: 'name',
			},
			address: {
				type: Sequelize.STRING,
				field: 'address',
			},
			isAdmin: {
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'is_admin',
			},
			avatar: {
				type: Sequelize.STRING,
				field: 'avatar',
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
		await queryInterface.dropTable('users');
	},
};
