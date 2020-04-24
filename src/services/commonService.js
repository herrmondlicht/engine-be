import queryHelperService from './databaseService/queryHelperService';

const getList = ({ queryService, resourceName }) => async ({ fields, limit, q, include } = {}) => {
  const resourceList = await queryService.getFrom(resourceName, { fields, limit, query: q, include });
  return resourceList;
};

const insertNew = ({ queryService, resourceName }) => async (data) => {
  const id = await queryService.insert(resourceName, data);
  const selectFromInsert = await queryService.getFrom(resourceName, { query: { id } });
  return selectFromInsert.length && selectFromInsert[0];
};

const update = ({ queryService, resourceName }) => async (updateId, data) => {
  const selectFromInsert = await queryService.update(resourceName, { id: updateId, ...data });
  return selectFromInsert;
};

export default ({ queryService = queryHelperService(), resourceName } = {}) => ({
  getList: getList({ queryService, resourceName }),
  insert: insertNew({ queryService, resourceName }),
  update: update({ queryService, resourceName }),
});
