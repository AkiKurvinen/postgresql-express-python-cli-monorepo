exports.up = function (knex) {
  return knex.schema.createTable('machines', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('userid').inTable('users').onDelete('CASCADE');
    table.string('name').notNullable().unique();
    table.timestamp('registered_date').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('machines');
};
