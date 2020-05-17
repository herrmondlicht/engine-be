const faker = require('faker');

const createRecord = (knex, { service_order_id }) => {
  return knex('service_order_items').insert({
    service_order_id,
    description: faker.random.words(3),
    quantity: faker.random.number(10),
    unit_price: faker.commerce.price(5, 500),
  });
};

exports.seed = (knex) => {
  return knex('service_order_items')
    .del()
    .then(async () => {
      const records = [];
      const serviceOrders = await knex('service_orders').select('id');

      for (let i = 0; i < serviceOrders.length * 3; i += 1) {
        const randomIndex = Math.floor(Math.random() * serviceOrders.length);
        const serviceOrderId = serviceOrders[randomIndex].id;
        records.push(createRecord(knex, { service_order_id: serviceOrderId }));
      }

      return Promise.all(records);
    });
};
