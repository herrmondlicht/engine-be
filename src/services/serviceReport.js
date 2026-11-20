const getServicePriceCalculation =
  ({ queryBuilder }) =>
  async () => {
    const calculations = await queryBuilder
      .from('service_orders')
      .select(queryBuilder.raw('month(created_at) as month'), queryBuilder.raw('year(created_at) as year'))
      .sum('service_price as service_price')
      .sum('discount_price as discount_price')
      .sum('service_items_price as service_items_price')
      .groupBy('year')
      .groupBy('month');

    return calculations;
  };

const getYearToDateTotals =
  ({ queryBuilder }) =>
  async () => {
    const {
      year,
      service_price: servicePrice,
      service_items_price: serviceItemsPrice,
    } = await queryBuilder
      .from('service_orders')
      .first(queryBuilder.raw('year(current_timestamp) as year'))
      .sum('service_price as service_price')
      .sum('service_items_price as service_items_price')
      .whereBetween('created_at', [queryBuilder.raw('makedate(year(current_timestamp), 1)'), queryBuilder.raw('current_timestamp')]);

    return {
      year,
      service_price: servicePrice ?? 0,
      service_items_price: serviceItemsPrice ?? 0,
    };
  };

export default ({ queryBuilder }) => ({
  getServicePriceCalculation: getServicePriceCalculation({ queryBuilder }),
  getYearToDateTotals: getYearToDateTotals({ queryBuilder }),
});
