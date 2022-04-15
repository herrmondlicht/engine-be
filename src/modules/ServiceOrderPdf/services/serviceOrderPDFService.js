export const makeGetPrintableData =
  ({ customerCarService, serviceOrderItemsService }) =>
  async (serviceOrderData) => {
    const customerCarDataPromise = customerCarService.getList({
      limit: 1,
      q: {
        id: serviceOrderData.customer_car_id,
      },
      include: 'cars,customers',
      searchDeletedRecords: true,
    });
    const serviceItemsPromise = serviceOrderItemsService.getList({
      q: {
        service_order_id: serviceOrderData.id,
      },
    });
    const [[customerCarsData], serviceItems] = await Promise.all([customerCarDataPromise, serviceItemsPromise]);
    return [customerCarsData, serviceItems];
  };
