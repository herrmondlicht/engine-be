import _queryBuilder from './queryBuilder';

const applyWhere = ( queryBuilderObject, query) => {
  const searchDeleted = query && query.deleted_at;
  if (!searchDeleted) {
    queryBuilderObject.whereNull('deleted_at');
  }
  if (query) {
    queryBuilderObject.where(query);
  }
  return queryBuilderObject;
};

const applyLimit = (queryBuilderObject, limit) => {
  if (limit) {
    return queryBuilderObject.limit(limit);
  }
  return queryBuilderObject;
};

const getFrom = ({ queryBuilder }) => async (tableName, { fields, query, limit } = {}) => {
  try {
    const columns = fields ? fields.split(',') : '*';
    const JSONQuery = typeof query === 'string' ? JSON.parse(query) : query;
    const builderQuery = queryBuilder.from(tableName).select(columns);
    applyWhere(builderQuery, JSONQuery);
    applyLimit(builderQuery, limit);

    return builderQuery;
  } catch (e) {
    if (e.code === 'ER_BAD_FIELD_ERROR') {
      const badFieldError = new Error('field declared in query was not found');
      badFieldError.isOperational = true;
      throw badFieldError;
    } else {
      throw e;
    }
  }
};

const insert = ({ queryBuilder }) => async (tableName, data) => {
  return queryBuilder.insert(data).into(tableName);
};

const update = ({ queryBuilder }) => async (tableName, data) => {
  const { id, ...updateData } = data;
  await queryBuilder(tableName).where({ id }).update(updateData);
  return { id };
};

export default ({ queryBuilder = _queryBuilder } = {}) => ({
  getFrom: getFrom({ queryBuilder }),
  insert: insert({ queryBuilder }),
  update: update({ queryBuilder }),
});
