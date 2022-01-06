import FK_CONSTANTS from './constants_FK';

const addResourcePrefixToKeys = (query, resource) => {
  const resourcedPrefixedQuery = {};
  Object.entries(query).forEach(([propertyKey, propertyValue]) => {
    const hasResourcePrefix = propertyKey.indexOf('.') !== -1;
    if (!hasResourcePrefix) {
      resourcedPrefixedQuery[`${resource}.${propertyKey}`] = propertyValue;
    } else {
      resourcedPrefixedQuery[propertyKey] = propertyValue;
    }
  });
  return resourcedPrefixedQuery;
};

const applyWhere = (queryBuilderObject, query, resource) => {
  if (query) {
    const resourcedPrefixedQuery = addResourcePrefixToKeys(query, resource);
    queryBuilderObject.where(resourcedPrefixedQuery);
  }
  return queryBuilderObject;
};

const applyDeletedAtLogic = (queryBuilderObject, query, resource) => {
  const searchDeleted = query?.deleted_at || query?.searchDeletedRecords;
  if (!searchDeleted) {
    queryBuilderObject.whereNull(`${resource}.deleted_at`);
  }
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
      queryBuilderObject.join(includeResource, `${tableName}.${FK_CONSTANTS[includeResource]}`, '=', `${includeResource}.id`).options({ nestTables: true });
    });
  }
};

const getFields = (fields) => (fields ? fields : ['*']);

const parseQueryToJSON = (query) => (typeof query === 'string' ? JSON.parse(query) : query);

const getFrom = ({ queryBuilder }) => async (
  tableName,
  { fields, query, limit, include, resourcesJoinIds, searchDeletedRecords, customQueryBuilderOperation } = {}
) => {
  try {
    const columns = getFields(fields);
    const JSONQuery = parseQueryToJSON(query);
    const builderQuery = queryBuilder.from(tableName).select(...columns);
    applyWhere(builderQuery, { ...JSONQuery, ...resourcesJoinIds }, tableName);
    applyDeletedAtLogic(builderQuery, { ...JSONQuery, searchDeletedRecords }, tableName);
    applyLimit(builderQuery, limit);
    applyInclude(builderQuery, { include, tableName });
    if (customQueryBuilderOperation) {
      customQueryBuilderOperation(builderQuery);
    }

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

export default ({ queryBuilder }) => ({
  getFrom: getFrom({ queryBuilder }),
});
