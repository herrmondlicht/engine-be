import sinon from 'sinon';
import serviceReport from './serviceReport';

describe('getServicePriceCalculation', () => {
  let queryBuilder;
  let getServicePriceCalculation;

  const updateGroupByStubReturnValue = (value) => {
    queryBuilder.groupBy.withArgs('year').returnsThis();
    queryBuilder.groupBy.withArgs('month').returns(value);
  };

  beforeEach(() => {
    queryBuilder = {
      from: sinon.stub().returnsThis(),
      select: sinon.stub().returnsThis(),
      raw: sinon.stub().returnsArg(0),
      sum: sinon.stub().returnsThis(),
      groupBy: sinon.stub(),
    };
    updateGroupByStubReturnValue([]);
    getServicePriceCalculation = serviceReport({ queryBuilder }).getServicePriceCalculation;
  });

  it('should return calculations', async () => {
    const expectedCalculations = [{ month: 1, year: 2023, service_price: 100, discount_price: 10, service_items_price: 50 }];
    updateGroupByStubReturnValue(expectedCalculations);
    const result = await getServicePriceCalculation();

    expect(result).toEqual(expectedCalculations);
    expect(queryBuilder.from.calledWith('service_orders')).toBe(true);
    expect(queryBuilder.select.calledWith(queryBuilder.raw('month(created_at) as month'), queryBuilder.raw('year(created_at) as year'))).toBe(true);
    expect(queryBuilder.sum.calledWith('service_price as service_price')).toBe(true);
    expect(queryBuilder.sum.calledWith('discount_price as discount_price')).toBe(true);
    expect(queryBuilder.sum.calledWith('service_items_price as service_items_price')).toBe(true);
    expect(queryBuilder.groupBy.calledWith('year')).toBe(true);
    expect(queryBuilder.groupBy.calledWith('month')).toBe(true);
  });

  it('should handle empty calculations', async () => {
    updateGroupByStubReturnValue([]);
    const result = await getServicePriceCalculation();

    expect(result).toEqual([]);
  });
});

describe('getYearToDateTotals', () => {
  let queryBuilder;
  let getYearToDateTotals;

  beforeEach(() => {
    queryBuilder = {
      from: sinon.stub().returnsThis(),
      first: sinon.stub().returnsThis(),
      raw: sinon.stub().returnsArg(0),
      sum: sinon.stub().returnsThis(),
      whereBetween: sinon.stub(),
    };
    getYearToDateTotals = serviceReport({ queryBuilder }).getYearToDateTotals;
  });

  it('sums labor and parts from the start of the current year through now', async () => {
    const totals = { year: 2026, service_price: '125.50', service_items_price: '240.75' };
    queryBuilder.whereBetween.resolves(totals);

    await expect(getYearToDateTotals()).resolves.toEqual(totals);
    expect(queryBuilder.from.calledWith('service_orders')).toBe(true);
    expect(queryBuilder.sum.calledWith('service_price as service_price')).toBe(true);
    expect(queryBuilder.sum.calledWith('service_items_price as service_items_price')).toBe(true);
    expect(queryBuilder.whereBetween.calledWith('created_at', ['makedate(year(current_timestamp), 1)', 'current_timestamp'])).toBe(true);
  });

  it('returns zero totals when there are no orders in the current year', async () => {
    queryBuilder.whereBetween.resolves({ year: 2026, service_price: null, service_items_price: null });

    await expect(getYearToDateTotals()).resolves.toEqual({ year: 2026, service_price: 0, service_items_price: 0 });
  });
});
