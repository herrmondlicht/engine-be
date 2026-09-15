const MONTHS_OF_HISTORY = 36;
const ORDERS_PER_MONTH = 5;
const ADDITIONAL_ORDERS_PER_MONTH = 3;
const MONTHLY_SEASONALITY = [0.78, 0.92, 1.12, 0.96, 1.06, 1.2, 0.9, 0.86, 0.94, 1.14, 1.22, 1.08];
const OBSERVATIONS = ['Revisão preventiva e inspeção geral.', 'Manutenção periódica com troca de componentes.', 'Diagnóstico e reparo do sistema mecânico.'];

const toCurrency = (value) => Math.round(value * 100) / 100;

const formatMySQLDate = (date) => date.toISOString().slice(0, 19).replace('T', ' ');

const getMonthDate = (endDate, monthOffset) => {
  const date = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() - monthOffset, 15, 12));
  return formatMySQLDate(date);
};

const createServiceOrderRecords = ({ customerCars, endDate = new Date() }) => {
  const records = [];

  for (let monthOffset = MONTHS_OF_HISTORY - 1; monthOffset >= 0; monthOffset -= 1) {
    const createdAt = getMonthDate(endDate, monthOffset);
    const createdDate = new Date(`${createdAt.replace(' ', 'T')}Z`);
    const month = createdDate.getUTCMonth();
    const yearGrowth = 1 + (MONTHS_OF_HISTORY - 1 - monthOffset) * 0.006;
    const orderCount = ORDERS_PER_MONTH + (monthOffset % (ADDITIONAL_ORDERS_PER_MONTH + 1));

    for (let orderIndex = 0; orderIndex < orderCount; orderIndex += 1) {
      const servicePrice = toCurrency((390 + orderIndex * 110 + ((monthOffset * 71) % 190)) * MONTHLY_SEASONALITY[month] * yearGrowth);
      const itemsMultiplier = 1.45 + ((orderIndex + monthOffset) % 3) * 0.22;
      const serviceItemsPrice = toCurrency(servicePrice * itemsMultiplier);
      const discountPrice = orderIndex === 0 && monthOffset % 3 === 0 ? toCurrency(servicePrice * 0.05) : 0;

      records.push({
        customer_car_id: customerCars[(monthOffset + orderIndex) % customerCars.length].id,
        order_status: 'paid',
        service_price: servicePrice,
        service_items_price: serviceItemsPrice,
        discount_price: discountPrice,
        observations: OBSERVATIONS[(monthOffset + orderIndex) % OBSERVATIONS.length],
        created_at: createdAt,
        updated_at: createdAt,
      });
    }
  }

  return records;
};

exports.clear = (knex) => knex('service_orders').del();

exports.createServiceOrderRecords = createServiceOrderRecords;

exports.seed = async (knex) => {
  await exports.clear(knex);
  const customerCars = await knex('customer_cars').select('id').limit(10);

  return knex('service_orders').insert(createServiceOrderRecords({ customerCars }));
};
