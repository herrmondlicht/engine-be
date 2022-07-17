const makeAddCar =
  ({ queryService, mysqlService }) =>
  async ({ created_at, updated_at, ...data }) => {
    await mysqlService.querySQLWithConnection(mysqlService.connectToDB())(
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

export default ({ queryService, mysqlService, CRUDServiceMethods }) => ({
  ...CRUDServiceMethods,
  insert: makeAddCar({ queryService, mysqlService }),
});
