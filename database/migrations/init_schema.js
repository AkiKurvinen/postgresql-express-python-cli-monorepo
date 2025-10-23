/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('userid').primary();
            table.string('username').notNullable();
            table.string('password').notNullable();
            table.string('role').notNullable().defaultTo('client');
        })
        .createTable('machines', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().references('userid').inTable('users').onDelete('CASCADE');
            table.string('name').notNullable().unique();
            table.timestamp('registered_date').defaultTo(knex.fn.now());
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('machines')
        .dropTableIfExists('users');
};
