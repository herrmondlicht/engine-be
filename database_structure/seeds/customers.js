const faker = require('faker');

const createRecord = (knex) => {
  return knex('customers').insert({
    document_number: faker.datatype.number(),
    fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: `${faker.address.streetAddress()} ${faker.address.city()} ${faker.address.country()}`,
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
  });
};

exports.seed = (knex) => {
  return knex('customers')
    .del()
    .then(() => {
      const records = [];

      for (let i = 0; i < 10; i += 1) {
        records.push(createRecord(knex, i));
      }

      return Promise.all(records);
    });
};
