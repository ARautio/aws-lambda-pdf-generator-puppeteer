import Knex from "knex";

/**
 * If you are using DB
 */
export const knex = Knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "username",
    password: "password",
    database: "database_name",
  },
});
