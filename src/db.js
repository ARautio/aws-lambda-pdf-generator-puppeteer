/**
 * If you are using
 */
var knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'username',
    password: 'password',
    database: 'database_name'
  }
})

module.exports = knex
