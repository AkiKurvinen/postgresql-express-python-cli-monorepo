/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    { username: 'alice', password: 'password123' },
    { username: 'bob', password: 'securepass' },
    { username: 'charlie', password: 'qwerty' }
  ]);
};
