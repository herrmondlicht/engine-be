const insert =
  ({ queryBuilder }) =>
  async (tableName, { created_at, updated_at, ...data }) => {
    return queryBuilder.insert(data).into(tableName);
  };

const update =
  ({ queryBuilder }) =>
  async (tableName, data) => {
    const { id, ...updateData } = data;
    await queryBuilder(tableName).where({ id }).update(updateData);
    return { ...updateData, id };
  };

export default ({ queryBuilder, getFrom } = {}) => ({
  getFrom,
  insert: insert({ queryBuilder }),
  update: update({ queryBuilder }),
});
