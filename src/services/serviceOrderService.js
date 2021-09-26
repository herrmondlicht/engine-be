import FK_CONSTANTS from './databaseService/constants_FK';
import _commonService from './commonService';
import _queryService from './databaseService/whereQueryHelperService';
import queryBuilder from './databaseService/queryBuilder';

const sumServiceItems = (builderQuery) => {
  builderQuery.join('service_order_items', `service_orders.id`, '=', `service_order_items.${FK_CONSTANTS.service_orders}`).sum({
    service_items_price: queryBuilder.raw('?? ?? ??', ['service_order_items.unit_price', '*', 'service_order_items.quantity']),
  });
};

export default ({ commonService = _commonService({ resourceName: 'service_orders' }), queryService = _queryService({ queryBuilder }) } = {}) => ({
  ...commonService,
  getList: async ({ limit, q, include, resourcesJoinIds } = {}) => {
    const resourceList = queryService.getFrom('service_orders', {
      fields: 'service_orders.*',
      limit,
      query: q,
      include,
      resourcesJoinIds,
      customQueryBuilderOperation: sumServiceItems,
    });
    return resourceList;
  },
});
