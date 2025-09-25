export default ({ openAIVisionService, customerCarService, serviceOrderService, serviceOrderItemsService } = {}) => ({
  async processImage(base64Image) {
    const parsed = await openAIVisionService.parseImage(base64Image);
    const { license_plate: licensePlate, items = [] } = parsed;

    if (!licensePlate) {
      const error = new Error('LICENSE_PLATE_NOT_FOUND');
      error.code = 'LICENSE_PLATE_NOT_FOUND';
      throw error;
    }

    const [customerCar] = await customerCarService.getList({
      limit: 1,
      q: { license_plate: licensePlate },
    });
    if (!customerCar) {
      const error = new Error('CAR_NOT_FOUND');
      error.code = 'CAR_NOT_FOUND';
      throw error;
    }

    const [serviceOrder] = await serviceOrderService.getList({
      limit: 1,
      resourcesJoinIds: { customer_car_id: customerCar.id },
      customQueryBuilderOperation: (qb) => qb.orderBy('service_orders.created_at', 'desc'),
    });
    if (!serviceOrder) {
      const error = new Error('SERVICE_ORDER_NOT_FOUND');
      error.code = 'SERVICE_ORDER_NOT_FOUND';
      throw error;
    }

    const createdItems = await Promise.all(
      items
        .filter(({ description }) => description)
        .map(async ({ description, quantity, unit_price }) => {
          return serviceOrderItemsService.insert({
            service_order_id: serviceOrder.id,
            description,
            quantity: quantity || 1,
            unit_price: unit_price || 0,
          });
        })
    );
    const updatedServiceOrder = await serviceOrderService.update(serviceOrder.id, {
      service_items_price: createdItems.reduce((acc, item) => acc + item.quantity * item.unit_price, 0),
    });

    return { serviceOrder: updatedServiceOrder, items: createdItems };
  },
});
