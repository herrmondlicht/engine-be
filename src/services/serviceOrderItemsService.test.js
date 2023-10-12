import makeServiceOrderItemsService, { makeUpdateItemsPrice } from './serviceOrderItemsService';

describe('ServiceOrderItemsService', () => {
  describe('insert', () => {
    it('should insert data and update items price if service_items_price is not 0', async () => {
      const data = {
        service_items_price: 10,
        service_order_id: 1,
      };
      const response = { id: 1 };
      const updateItemsPrice = jest.fn();
      const commonService = {
        insert: jest.fn().mockResolvedValue(response),
      };
      const queryService = {};
      const queryBuilder = { from: jest.fn() };
      const service = makeServiceOrderItemsService({ commonService, queryService, queryBuilder, makeUpdateItemsPrice: () => updateItemsPrice });

      const result = await service.insert(data);

      expect(commonService.insert).toHaveBeenCalledWith(data);
      expect(updateItemsPrice).toHaveBeenCalledWith(data.service_order_id);
      expect(result).toEqual(response);
    });

    it('should insert data and not update items price if service_items_price is 0', async () => {
      const data = {
        service_items_price: 0,
        service_order_id: 1,
      };
      const response = { id: 1 };
      const updateItemsPrice = jest.fn();
      const commonService = {
        insert: jest.fn().mockResolvedValue(response),
      };
      const queryService = {};
      const queryBuilder = {};
      const service = makeServiceOrderItemsService({ commonService, queryService, queryBuilder, makeUpdateItemsPrice: () => updateItemsPrice });

      const result = await service.insert(data);

      expect(commonService.insert).toHaveBeenCalledWith(data);
      expect(updateItemsPrice).not.toHaveBeenCalled();
      expect(result).toEqual(response);
    });
  });
});

describe('update', () => {
  let commonService;
  let queryService;
  let queryBuilder;
  let makeUpdateItemsPrice;
  let service;

  beforeEach(() => {
    commonService = {
      update: jest.fn(),
    };
    queryService = {
      getFrom: jest.fn().mockReturnValue({
        first: jest.fn(),
      }),
    };
    queryBuilder = {};
    makeUpdateItemsPrice = jest.fn();
    service = makeServiceOrderItemsService({ commonService, queryService, queryBuilder, makeUpdateItemsPrice });
  });

  it('should update data and update items price', async () => {
    const id = 1;
    const data = {
      service_items_price: 10,
    };
    const response = { id };
    const serviceOrderItem = { service_order_id: 1 };
    const updateItemsPrice = jest.fn();
    commonService.update.mockResolvedValueOnce(response);
    queryService.getFrom.mockReturnValueOnce({
      first: jest.fn().mockResolvedValueOnce(serviceOrderItem),
    });
    makeUpdateItemsPrice.mockReturnValueOnce(updateItemsPrice);

    const result = await service.update(id, data);

    expect(commonService.update).toHaveBeenCalledWith(id, data);
    expect(queryService.getFrom).toHaveBeenCalledWith('service_order_items', { query: { id }, searchDeletedRecords: true });
    expect(makeUpdateItemsPrice).toHaveBeenCalledWith({ queryService, queryBuilder });
    expect(updateItemsPrice).toHaveBeenCalledWith(serviceOrderItem.service_order_id);
    expect(result).toEqual(response);
  });
});

describe('makeUpdateItemsPrice', () => {
  let queryService;
  let queryBuilder;
  let update;

  beforeEach(() => {
    queryService = {
      update: jest.fn(),
    };
    queryBuilder = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn(),
      raw: jest.fn(),
    };
    update = makeUpdateItemsPrice({ queryService, queryBuilder });
  });

  it('should update service_items_price with total price when there are items', async () => {
    const service_order_id = 1;
    const total_price = 100;
    const priceObject = { total_price };
    queryBuilder.first.mockResolvedValueOnce(priceObject);

    await update(service_order_id);

    expect(queryBuilder.from).toHaveBeenCalledWith('service_order_items');
    expect(queryBuilder.select).toHaveBeenCalledWith(queryBuilder.raw('SUM(quantity * unit_price) as total_price'));
    expect(queryBuilder.where).toHaveBeenCalledWith({ service_order_id, deleted_at: null });
    expect(queryBuilder.first).toHaveBeenCalled();
    expect(queryService.update).toHaveBeenCalledWith('service_orders', { id: service_order_id, service_items_price: total_price });
  });

  it('should not update service_items_price when there are no items', async () => {
    const service_order_id = 1;
    const priceObject = null;
    queryBuilder.first.mockResolvedValueOnce(priceObject);

    await update(service_order_id);

    expect(queryBuilder.from).toHaveBeenCalledWith('service_order_items');
    expect(queryBuilder.select).toHaveBeenCalledWith(queryBuilder.raw('SUM(quantity * unit_price) as total_price'));
    expect(queryBuilder.where).toHaveBeenCalledWith({ service_order_id, deleted_at: null });
    expect(queryBuilder.first).toHaveBeenCalled();
    expect(queryService.update).not.toHaveBeenCalled();
  });
});
