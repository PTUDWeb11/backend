'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	// add search vector column
	await queryInterface.sequelize.query(`
		ALTER TABLE products ADD COLUMN search_vector TSVECTOR 
		GENERATED ALWAYS AS
		(setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
		setweight(to_tsvector('english', coalesce(description, '')), 'B')) STORED;`);

	// add index for search vector column
	await queryInterface.sequelize.query(`CREATE INDEX search_vector_idx ON products USING GIN(search_vector);`);
}
export async function down(queryInterface, Sequelize) {
	// drop column search vector
	await queryInterface.removeColumn('products', 'search_vector');
}
