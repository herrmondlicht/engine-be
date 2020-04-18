import queryHelperService from './queryHelperService';
import MySqlService from './mysqlService';

export default ({ queryService = queryHelperService(), mysqlService = MySqlService(), connection = mysqlService.connectToDB() } = {}) => ({
  getList: async ({ fields, limit, query } = {}) => {
    const carList = await queryService.getFrom('cars', { fields, limit, query });
    return carList;
  },
  addCar: async (data) => {
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
  },
});
