/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('users', function(table) {
		table.increments('userid').primary();
		table.string('username').notNullable();
		table.string('password').notNullable();
		table.string('role').notNullable().defaultTo('client');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTableIfExists('users');
};
