import queryHelperService from './databaseService/queryHelperService';
import MySqlService from './databaseService/mysqlService';

const getList = ({ queryService }) => async ({ fields, limit, q } = {}) => {
  const carList = await queryService.getFrom('cars', { fields, limit, query: q });
  return carList;
};

const addCar = ({ queryService, mysqlService, connection }) => async (data) => {
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

export default ({ queryService = queryHelperService(), mysqlService = MySqlService(), connection = mysqlService.connectToDB() } = {}) => ({
  getList: getList({ queryService }),
  addCar: addCar({ queryService, mysqlService, connection }),
});
