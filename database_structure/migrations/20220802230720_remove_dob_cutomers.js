exports.up = function (knex) {
  return knex.schema.table('customers', (table) => {
    table.dropColumn('date_of_birth');
  });
};

exports.down = function (knex) {
  return knex.schema.table('customers', (table) => {
    table.date('date_of_birth');
  });
};
