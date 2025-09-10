exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('machines').del();
  await knex('machines').insert([
    {
      user_id: 1,
      name: 'Machine Alpha',
      registered_date: '2025-09-10T10:00:00Z'
    },
    {
      user_id: 1,
      name: 'Machine Beta',
      registered_date: '2025-10-10T11:00:00Z'
    },
    {
      user_id: 2,
      name: 'Machine Charlie',
      registered_date: '2025-11-10T11:00:00Z'
    }
  ]);
};
