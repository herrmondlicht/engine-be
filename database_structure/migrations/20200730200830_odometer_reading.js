exports.up = function (knex) {
  return knex.schema.table('service_orders', (table) => {
    table.text('odometer_reading');
  });
};

exports.down = function (knex) {
  return knex.schema.table('service_orders', (table) => {
    table.dropColumn('odometer_reading');
  });
};
