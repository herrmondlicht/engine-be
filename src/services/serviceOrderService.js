export default ({ commonService, queryService, queryBuilder } = {}) => ({
  ...commonService,
  // getList: async ({ limit, q, include, resourcesJoinIds } = {}) => {
  //   const includeSelect =
  //     include
  //       ?.split(',')
  //       ?.map((includeItem) => `${includeItem}.*`)
  //       ?.join(',') || '';
  //   const resourceList = queryService.getFrom('service_orders', {
  //     fields: [
  //       queryBuilder.raw('*'),
  //       queryBuilder.raw(
  //         '(select SUM(unit_price *  quantity) from service_order_items where service_order_id=service_orders.id and deleted_at is null) as service_items_price'
  //       ),
  //       ...(includeSelect ? [queryBuilder.raw(includeSelect)] : []),
  //     ],
  //     limit,
  //     query: q,
  //     include,
  //     resourcesJoinIds,
  //   });
  //   return resourceList;
  // },
});
