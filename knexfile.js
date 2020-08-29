// Update with your config settings.
const { DATABASE_URL } = require('./src/constants/sqlCredentials');

const commonConfig = {
  client: 'mysql',
  connection: DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migration',
    directory: './database_structure/migrations',
  },
};

module.exports = {
  development: {
    ...commonConfig,
    seeds: {
      directory: './database_structure/seeds',
    },
  },

  staging: {
    ...commonConfig,
  },

  production: {
    ...commonConfig,
  },
};
