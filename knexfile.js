// Update with your config settings.
const { DATABASE_CONFIG } = require('./src/constants/sqlCredentials');

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      ...DATABASE_CONFIG,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migration',
    },
  },

  staging: {
    client: 'mysql',
    connection: {
      ...DATABASE_CONFIG,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migration',
    },
  },

  production: {
    client: 'mysql',
    connection: {
      ...DATABASE_CONFIG,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migration',
    },
  },
};
