const createRecord = (knex, { car_id, customer_id }) => {
  return knex('customer_cars').insert({
    license_plate: `DEV${String(car_id).padStart(4, '0')}`,
    car_id,
    customer_id,
    displacement: `${1 + (car_id % 3)}.0`,
    color: ['Prata', 'Preto', 'Branco', 'Azul'][car_id % 4],
  });
};

exports.clear = (knex) => knex('customer_cars').del();

exports.seed = (knex) => {
  return exports.clear(knex).then(async () => {
    const records = [];
    const cars = await knex('cars').select('id').limit(10);
    const customers = await knex('customers').select('id').limit(10);

    for (let i = 0; i < 10; i += 1) {
      const carId = cars[i].id;
      const customerId = customers[i].id;
      records.push(createRecord(knex, { car_id: carId, customer_id: customerId }));
    }

    return Promise.all(records);
  });
};
