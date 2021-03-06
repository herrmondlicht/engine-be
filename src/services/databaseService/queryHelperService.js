import _queryBuilder from './queryBuilder';
import _whereQueryHelper from './whereQueryHelperService';

const insert = ({ queryBuilder }) => async (tableName, data) => {
  return queryBuilder.insert(data).into(tableName);
};

const update = ({ queryBuilder }) => async (tableName, data) => {
  const { id, ...updateData } = data;
  await queryBuilder(tableName).where({ id }).update(updateData);
  return { id };
};

export default ({ queryBuilder = _queryBuilder, whereQueryHelper = _whereQueryHelper({ queryBuilder }) } = {}) => ({
  getFrom: whereQueryHelper.getFrom,
  insert: insert({ queryBuilder }),
  update: update({ queryBuilder }),
});
