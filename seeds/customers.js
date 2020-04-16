const faker = require('faker');

const createRecord = (knex) => {
  return knex('customers').insert({
    document_number: faker.random.number(),
    fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: `${faker.address.streetAddress()} ${faker.address.city()} ${faker.address.country()}`,
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    date_of_birth: faker.date.past()
  });
};

exports.seed = (knex) => {
  return knex('customers')
    .del()
    .then(() => {
      const records = [];

      for (let i = 1; i < 10; i+=1) {
        records.push(createRecord(knex, i));
      }

      return Promise.all(records);
    });
};
