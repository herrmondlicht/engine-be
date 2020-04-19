import queryHelperService from './queryHelperService';
import MySqlService from './mysqlService';

const getList = ({ queryService }) => async ({ fields, limit, query } = {}) => {
  const carList = await queryService.getFrom('cars', { fields, limit, query });
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
  getList: getList({ queryService, mysqlService, connection }),
  addCar: addCar({ queryService }),
});
