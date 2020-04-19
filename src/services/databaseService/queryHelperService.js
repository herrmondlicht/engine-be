import _queryBuilder from './queryBuilder';

const applyWhere = (queryBuilderObject, query) => {
  if (query) {
    return queryBuilderObject.where(query);
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

export default ({ queryBuilder = _queryBuilder } = {}) => ({
  getFrom: getFrom({ queryBuilder }),
});
