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
