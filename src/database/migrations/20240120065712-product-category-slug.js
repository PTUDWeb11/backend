'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	// create unaccent extension
	await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS unaccent;`);

	// add slug column to categories table
	await queryInterface.addColumn('categories', 'slug', {
		type: Sequelize.STRING,
		after: 'name',
	});

	// convert name to slug for existing categories
	const categories = await queryInterface.sequelize.query(
		`UPDATE categories SET slug = trim(BOTH '-' FROM regexp_replace(lower(unaccent(trim(name))), '[^a-z0-9\\\\-_]+', '-', 'gi'));`
	);

	// add unique non-null constraint to slug column
	await queryInterface.changeColumn('categories', 'slug', {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	});

	// add slug column to products table
	await queryInterface.addColumn('products', 'slug', {
		type: Sequelize.STRING,
		after: 'name',
	});

	// convert name to slug for existing products
	const products = await queryInterface.sequelize.query(
		`UPDATE products SET slug = trim(BOTH '-' FROM regexp_replace(lower(unaccent(trim(name))), '[^a-z0-9\\\\-_]+', '-', 'gi'));`
	);

	// add unique non-null constraint to slug column
	await queryInterface.changeColumn('products', 'slug', {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	});
}
export async function down(queryInterface, Sequelize) {
	// remove slug column from categories table
	await queryInterface.removeColumn('categories', 'slug');

	// remove slug column from products table
	await queryInterface.removeColumn('products', 'slug');
}
