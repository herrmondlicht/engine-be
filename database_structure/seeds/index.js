const cars = require('./cars');
const customerCars = require('./customer_cars');
const customers = require('./customers');

function runConcurrent(knex) {
  return Promise.all([cars.seed(knex), customers.seed(knex)]);
}

async function runSeed(knex) {
  await runConcurrent(knex);
  await customerCars.seed(knex);
}

exports.seed = runSeed;
