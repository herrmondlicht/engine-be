export const makeApplyWhere =
  ({ addResourcePrefixToColumns }) =>
  (queryBuilderObject, query, resource) => {
    if (query) {
      const resourcedPrefixedQuery = addResourcePrefixToColumns(query, resource);
      queryBuilderObject.where(resourcedPrefixedQuery);
    }
    return queryBuilderObject;
  };

export const handlesDeletedAt = (queryBuilderObject, query, resource) => {
  const searchDeleted = query?.deleted_at || query?.searchDeletedRecords;
  if (!searchDeleted) {
    queryBuilderObject.whereNull(`${resource}.deleted_at`);
  }
  return queryBuilderObject;
};

export const applyLimit = (queryBuilderObject, limit) => {
  if (limit) {
    return queryBuilderObject.limit(limit);
  }
  return queryBuilderObject;
};

export const makeApplyInclude =
  ({ FK_CONSTANTS }) =>
  (queryBuilderObject, { include, tableName }) => {
    if (include) {
      include.split(',').forEach((includeResource) => {
        queryBuilderObject.join(includeResource, `${tableName}.${FK_CONSTANTS[includeResource]}`, '=', `${includeResource}.id`).options({ nestTables: true });
      });
    }
    return queryBuilderObject;
  };

export const getFields = (fields) => fields || ['*'];

export const parseQueryToJSON = (query) => (typeof query === 'string' ? JSON.parse(query) : query);

export const addResourcePrefixToColumns = (query, resource) => {
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

export const makeGetFrom =
  ({ queryBuilder, applyWhere, applyInclude, handlesDeletedAt, applyLimit }) =>
  (tableName, { fields, query, limit, include, resourcesJoinIds, searchDeletedRecords, customQueryBuilderOperation } = {}) => {
    try {
      const columns = getFields(fields);
      const JSONQuery = parseQueryToJSON(query);
      const builderQuery = queryBuilder.from(tableName).select(...columns);
      applyWhere(builderQuery, { ...JSONQuery, ...resourcesJoinIds }, tableName);
      handlesDeletedAt(builderQuery, { ...JSONQuery, searchDeletedRecords }, tableName);
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
