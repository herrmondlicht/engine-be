import knex from 'knex';

import { DATABASE_URL } from '../../../constants/sqlCredentials';

export default knex({
  client: 'mysql',
  connection: DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
});
