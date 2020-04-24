import _queryBuilder from './queryBuilder';
import FK_CONSTANTS from './constants_FK';

const applyWhere = (queryBuilderObject, query, resource) => {
  const searchDeleted = query && query.deleted_at;
  if (!searchDeleted) {
    queryBuilderObject.whereNull(`${resource}.deleted_at`);
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

const applyInclude = (queryBuilderObject, { include, tableName }) => {
  if (include) {
    include.split(',').forEach((includeResource) => {
      queryBuilderObject.join(includeResource, `${tableName}.${FK_CONSTANTS[includeResource]}`, '=', `${includeResource}.id`);
    });
  }
};

const getFrom = ({ queryBuilder }) => async (tableName, { fields, query, limit, include } = {}) => {
  try {
    const columns = fields ? fields.split(',') : '*';
    const JSONQuery = typeof query === 'string' ? JSON.parse(query) : query;
    const builderQuery = queryBuilder.from(tableName).select(columns);
    applyWhere(builderQuery, JSONQuery, tableName);
    applyLimit(builderQuery, limit);
    applyInclude(builderQuery, { include, tableName });

    return builderQuery.options({ nestTables: true });
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
