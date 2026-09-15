const { createServiceOrderItemRecords } = require('./service_order_items');

describe('service order item seed data', () => {
  it('creates three items that add up to each order total', () => {
    const records = createServiceOrderItemRecords([{ id: 1, service_items_price: '123.45', created_at: '2026-09-15 12:00:00' }]);

    expect(records).toHaveLength(3);
    expect(records.every((record) => record.service_order_id === 1)).toBe(true);
    expect(records.reduce((total, record) => total + record.unit_price, 0)).toBeCloseTo(123.45);
  });
});
