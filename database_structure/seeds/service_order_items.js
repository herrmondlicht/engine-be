const ITEM_DESCRIPTIONS = ['Filtro de óleo', 'Óleo do motor', 'Pastilha de freio'];

const toCurrency = (value) => Math.round(value * 100) / 100;

const createServiceOrderItemRecords = (serviceOrders) => {
  return serviceOrders.flatMap((serviceOrder) => {
    const total = Number(serviceOrder.service_items_price);
    const firstItemPrice = toCurrency(total * 0.5);
    const secondItemPrice = toCurrency(total * 0.3);
    const thirdItemPrice = toCurrency(total - firstItemPrice - secondItemPrice);

    return [firstItemPrice, secondItemPrice, thirdItemPrice].map((unitPrice, index) => ({
      service_order_id: serviceOrder.id,
      description: ITEM_DESCRIPTIONS[index],
      quantity: 1,
      unit_price: unitPrice,
      created_at: serviceOrder.created_at,
      updated_at: serviceOrder.created_at,
    }));
  });
};

exports.clear = (knex) => knex('service_order_items').del();

exports.createServiceOrderItemRecords = createServiceOrderItemRecords;

exports.seed = async (knex) => {
  await exports.clear(knex);
  const serviceOrders = await knex('service_orders').select('id', 'service_items_price', 'created_at');

  return knex('service_order_items').insert(createServiceOrderItemRecords(serviceOrders));
};
