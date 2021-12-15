exports.up = function (knex) {
  return knex.schema.table('customer_cars', (table) => {
    table.dropColumn('displacement');
  });
};

exports.down = function (knex) {
  return knex.schema.table('customer_cars', (table) => {
    table.string('displacement', 30);
  });
};
