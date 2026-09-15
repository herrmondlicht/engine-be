const { createServiceOrderRecords } = require('./service_orders');

describe('service order seed data', () => {
  it('creates several paid orders for each of the latest 36 months', () => {
    const records = createServiceOrderRecords({
      customerCars: [{ id: 1 }, { id: 2 }],
      endDate: new Date('2026-09-15T12:00:00.000Z'),
    });
    const months = [...new Set(records.map((record) => record.created_at.slice(0, 7)))];

    expect(months).toHaveLength(36);
    expect(months[0]).toBe('2023-10');
    expect(months[35]).toBe('2026-09');
    expect(records).toHaveLength(234);
    expect(records.every((record) => record.order_status === 'paid')).toBe(true);
    expect(records.every((record) => record.service_price > 0)).toBe(true);
    expect(records.every((record) => record.service_items_price > 0)).toBe(true);
  });
});
