import queryHelperService from './databaseService/queryHelperService';
import MySqlService from './databaseService/mysqlService';
import _commonService from './commonService';

const addCar = ({ queryService, mysqlService, connection }) => async ({ created_at, updated_at, ...data }) => {
  await mysqlService.querySQLWithConnection(connection)(
    `
      INSERT INTO cars SET ?
      ON DUPLICATE KEY UPDATE
      ?;
  `,
    [data, data]
  );
  const selectFromInsert = await queryService.getFrom('cars', { query: data });
  return selectFromInsert;
};

export default ({
  queryService = queryHelperService(),
  mysqlService = MySqlService(),
  connection = mysqlService.connectToDB(),
  commonService = _commonService({ queryService, resourceName: 'cars' }),
} = {}) => ({
  ...commonService,
  insert: addCar({ queryService, mysqlService, connection }),
});
