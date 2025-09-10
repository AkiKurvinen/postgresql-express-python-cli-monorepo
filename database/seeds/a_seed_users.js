
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  const users = [
    { username: 'alice', password: 'password123', role: 'admin' },
    { username: 'bob', password: 'securepass', role: 'client' },
    { username: 'charlie', password: 'qwerty', role: 'client' }
  ];

  // Hash passwords
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }

  await knex('users').insert(users);
};
