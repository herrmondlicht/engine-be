const _makeUpdateItemsPrice =
  ({ queryService, queryBuilder }) =>
  async (service_order_id) => {
    const priceObject = await queryBuilder
      .from('service_order_items')
      .select(queryBuilder.raw('SUM(quantity * unit_price) as total_price'))
      .where({ service_order_id, deleted_at: null })
      .first();
    if (!priceObject) return;
    await queryService.update('service_orders', { id: service_order_id, service_items_price: priceObject.total_price || 0 });
  };

export default ({ commonService, queryService, queryBuilder, makeUpdateItemsPrice = _makeUpdateItemsPrice } = {}) => ({
  ...commonService,
  insert: async (data) => {
    const updateItemsPrice = makeUpdateItemsPrice({ queryService, queryBuilder });

    const response = await commonService.insert(data);
    if (data.service_items_price && Number(data.service_items_price) !== 0) {
      await updateItemsPrice(data.service_order_id);
    }

    return response;
  },
  update: async (id, data) => {
    const updateItemsPrice = makeUpdateItemsPrice({ queryService, queryBuilder });
    const response = await commonService.update(id, data);
    const serviceOrderItem = await queryService.getFrom('service_order_items', { query: { id }, searchDeletedRecords: true }).first();
    await updateItemsPrice(serviceOrderItem.service_order_id);
    return response;
  },
});

export const makeUpdateItemsPrice = _makeUpdateItemsPrice;
