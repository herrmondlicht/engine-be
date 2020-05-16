const faker = require('faker');

const createRecord = (knex, { customer_car_id }) => {
  return knex('service_orders').insert({
    customer_car_id,
    service_price: faker.commerce.price(50, 1500, 2),
    service_items_price: faker.commerce.price(),
    discount_price: faker.commerce.price(0, 25, 2),
    observations: faker.lorem.sentences(4),
  });
};

exports.seed = (knex) => {
  return knex('service_orders')
    .del()
    .then(async () => {
      const records = [];
      const customerCars = await knex('customer_cars').select('id').limit(10);

      for (let i = 0; i < 20; i += 1) {
        const randomIndex = Math.floor(Math.random() * 10);
        const customerCarId = customerCars[randomIndex].id;
        records.push(createRecord(knex, { customer_car_id: customerCarId }));
      }

      return Promise.all(records);
    });
};
