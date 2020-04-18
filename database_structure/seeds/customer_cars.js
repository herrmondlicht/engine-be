const faker = require('faker');

const createRecord = (knex, { car_id, customer_id }) => {
  return knex('customer_cars').insert({
    license_plate: faker.random.word().slice(0, 3).toUpperCase() + faker.random.number(9999),
    car_id,
    customer_id,
    displacement: `${faker.random.number(9)}.${faker.random.number(9)}`,
    color: faker.vehicle.color(),
  });
};

exports.seed = (knex) => {
  return knex('customer_cars')
    .del()
    .then(async () => {
      const records = [];
      const cars = await knex('cars').select('id').limit(10);
      const customers = await knex('customers').select('id').limit(10);
      
      for (let i = 0; i < 10; i += 1) {
        const carId = cars[i].id;
        const customerId = customers[i].id;
        records.push(createRecord(knex, { car_id: carId, customer_id: customerId }));
      }

      return Promise.all(records);
    });
};
