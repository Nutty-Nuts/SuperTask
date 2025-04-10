const { Pool } = require("pg");
const fs = require("fs");

const {
  POSTGRES_USER: USER,
  POSTGRES_USER_FILE: USER_FILE,
  POSTGRES_PASSWORD: PASSWORD,
  POSTGRES_PASSWORD_FILE: PASSWORD_FILE,
  POSTGRES_DB: DB,
  POSTGRES_DB_FILE: DB_FILE,
  POSTGRES_PORT: PORT,
} = process.env;

const pool = new Pool({
  port: PORT,
  user: USER_FILE ? fs.readFileSync(USER_FILE) : USER,
  password: PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE) : PASSWORD,
  database: DB_FILE ? fs.readFileSync(DB_FILE) : DB,
});

module.exports = pool;
