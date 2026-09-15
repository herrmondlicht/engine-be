const DEFAULT_SORTABLE_FIELDS = ['id', 'created_at', 'updated_at'];
const SORT_DIRECTIONS = ['asc', 'desc'];

const makeOrderByOperation =
  ({ resourceName, sortableFields, defaultOrderBy, defaultOrder }) =>
  ({ orderBy, order }) => {
    const selectedOrderBy = sortableFields.includes(orderBy) ? orderBy : defaultOrderBy;
    if (!selectedOrderBy) return undefined;

    const selectedOrder = String(order).toLowerCase();
    const fallbackOrder = SORT_DIRECTIONS.includes(defaultOrder) ? defaultOrder : 'asc';
    const orderDirection = SORT_DIRECTIONS.includes(selectedOrder) ? selectedOrder : fallbackOrder;

    return (builderQuery) => builderQuery.orderBy(`${resourceName}.${selectedOrderBy}`, orderDirection);
  };

const composeQueryBuilderOperations = (firstOperation, secondOperation) => {
  if (!firstOperation) return secondOperation;
  if (!secondOperation) return firstOperation;
  return (builderQuery) => {
    firstOperation(builderQuery);
    secondOperation(builderQuery);
  };
};

const getList =
  ({ queryService, resourceName, sortableFields, defaultOrderBy, defaultOrder }) =>
  async ({ fields, limit, q, include, resourcesJoinIds, searchDeletedRecords, orderBy, order, customQueryBuilderOperation } = {}) => {
    const orderByOperation = makeOrderByOperation({ resourceName, sortableFields, defaultOrderBy, defaultOrder })({ orderBy, order });
    const resourceList = await queryService.getFrom(resourceName, {
      fields,
      limit,
      query: q,
      include,
      resourcesJoinIds,
      searchDeletedRecords,
      customQueryBuilderOperation: composeQueryBuilderOperations(orderByOperation, customQueryBuilderOperation),
    });
    return resourceList;
  };

const insertNew =
  ({ queryService, resourceName }) =>
  async (data) => {
    const id = await queryService.insert(resourceName, data);
    const selectFromInsert = await queryService.getFrom(resourceName, { query: { id } });
    return selectFromInsert.length && selectFromInsert[0];
  };

const update =
  ({ queryService, resourceName }) =>
  async (updateId, data) => {
    const selectFromInsert = await queryService.update(resourceName, { id: updateId, ...data });
    return selectFromInsert;
  };

export default ({ queryService, resourceName, sortableFields = DEFAULT_SORTABLE_FIELDS, defaultOrderBy, defaultOrder } = {}) => ({
  getList: getList({ queryService, resourceName, sortableFields, defaultOrderBy, defaultOrder }),
  insert: insertNew({ queryService, resourceName }),
  update: update({ queryService, resourceName }),
});
