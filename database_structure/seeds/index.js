const cars = require('./cars');
const customerCars = require('./customer_cars');
const customers = require('./customers');
const serviceOrders = require('./service_orders');
const serviceOrderItems = require('./service_order_items');

function runConcurrent(knex) {
  return Promise.all([cars.seed(knex), customers.seed(knex)]);
}

async function runSeed(knex) {
  await runConcurrent(knex);
  await customerCars.seed(knex);
  await serviceOrders.seed(knex);
  await serviceOrderItems.seed(knex);
}

exports.seed = runSeed;
