// Update with your config settings.
const { DATABASE_CONFIG } = require('./src/constants/sqlCredentials');

const commonConfig = {
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
};

module.exports = {
  development: {
    ...commonConfig,
    seeds:{
      directory:"./database_structure/seeds"
    }
  },

  staging: {
    ...commonConfig,
  },

  production: {
    ...commonConfig,
  },
};
