const faker = require('faker');

const createRecord = (knex) => {
  return knex('cars').insert({
    model: faker.vehicle.model(),
    make: faker.vehicle.manufacturer(),
    manufacture_year: faker.date.past().getFullYear(),
    fuel: faker.vehicle.fuel().toLowerCase(),
  });
};

exports.seed = (knex) => {
  return knex('cars')
    .del()
    .then(() => {
      const records = [];

      for (let i = 0; i < 10; i += 1) {
        records.push(createRecord(knex, i));
      }

      return Promise.all(records);
    });
};
