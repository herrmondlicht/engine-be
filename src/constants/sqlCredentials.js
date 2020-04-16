require('dotenv').config();

const { DB_PASSWORD, DB_HOST } = process.env;

const DATABASE_CONFIG = {
  host: DB_HOST,
  password: DB_PASSWORD,
  database: 'engine',
  user: 'root',
  port: 3307,
};

module.exports = { DATABASE_CONFIG };
