exports.up = function (knex) {
  return knex.schema.table('service_orders', (table) => {
    table.string('odometer_reading', 30);
  });
};

exports.down = function (knex) {
  return knex.schema.table('service_orders', (table) => {
    table.dropColumn('odometer_reading');
  });
};
