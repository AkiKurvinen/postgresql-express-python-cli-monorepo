const knex = require('knex');
const knexConfig = require('../database/knexfile');

// Use development config for now
const db = knex(knexConfig.development);

module.exports = db;
