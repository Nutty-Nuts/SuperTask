const { Pool } = require("pg");
const fs = require("fs");

const pool = new Pool({
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: fs.readFileSync(process.env.POSTGRES_PASSWORD_FILE),
  database: process.env.POSTGRES_DB,
});

console.log(process.env.POSTGRES_PORT);

module.exports = pool;
