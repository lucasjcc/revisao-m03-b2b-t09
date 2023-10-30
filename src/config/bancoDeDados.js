const { Pool } = require("pg");

const conexaoPostgres = new Pool({
  user: "postgres",
  host: "localhost",
  database: "roteiros",
  password: "postgres",
  port: 5432,
});

module.exports = conexaoPostgres;
