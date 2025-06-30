export default ({
  openAIVisionService,
  customerCarService,
  serviceOrderService,
  serviceOrderItemsService,
} = {}) => ({
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

    const createdItems = [];
    for (const item of items) {
      const { description, quantity, unit_price } = item;
      if (!description) continue;
      const newItem = await serviceOrderItemsService.insert({
        service_order_id: serviceOrder.id,
        description,
        quantity: quantity || 1,
        unit_price: unit_price || 0,
        service_items_price: quantity && unit_price ? quantity * unit_price : 0,
      });
      createdItems.push(newItem);
    }

    return { serviceOrder, items: createdItems };
  },
});
