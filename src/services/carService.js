export const makeAddCar =
  ({ queryService, mysqlService }) =>
  async ({ created_at, updated_at, deleted_at, id, ...data }) => {
    const alreadyRegisterdCar = await queryService.getFrom('cars', { query: data }).first();
    if (alreadyRegisterdCar) {
      return alreadyRegisterdCar;
    }

    await mysqlService.querySQLWithConnection(mysqlService.connectToDB())(
      `
        INSERT INTO cars SET ?
        ON DUPLICATE KEY UPDATE
        ?;
    `,
      [data, data]
    );
    const selectFromInsert = await queryService.getFrom('cars', { query: data }).first();
    return selectFromInsert;
  };

export default ({ queryService, mysqlService, CRUDServiceMethods }) => ({
  ...CRUDServiceMethods,
  insert: makeAddCar({ queryService, mysqlService }),
});
