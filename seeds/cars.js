const faker = require('faker');

const createRecord = (knex) => {
  return knex('cars').insert({
    model: faker.random.word(),
    make: faker.random.word(),
    manufacture_year: faker.date.past().getFullYear()
  });
};

exports.seed = (knex) => {
  return knex('cars')
    .del()
    .then(() => {
      const records = [];

      for (let i = 1; i < 10; i+=1) {
        records.push(createRecord(knex, i));
      }

      return Promise.all(records);
    });
};
