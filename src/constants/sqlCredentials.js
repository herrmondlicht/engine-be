require('dotenv').config();

const { DB_PASSWORD, DB_HOST, DB_PORT, DB_USER } = process.env;

const DATABASE_CONFIG = {
  host: DB_HOST,
  password: DB_PASSWORD,
  database: 'engine',
  user: DB_USER,
  port: DB_PORT,
};

module.exports = { DATABASE_CONFIG };
