import knex from 'knex';

import { DATABASE_CONFIG } from '../../constants/sqlCredentials';

export default knex({
  client: 'mysql',
  connection: {
    ...DATABASE_CONFIG,
  },
  pool: {
    min: 2,
    max: 10,
  },
});
