import makeCRUDService from './makeCRUDService';

describe('makeCRUDService', () => {
  it('getList should forward params to queryService.getFrom', async () => {
    const queryService = { getFrom: jest.fn().mockResolvedValue(['row']) };
    const service = makeCRUDService({ queryService, resourceName: 'cars' });
    const customQueryBuilderOperation = jest.fn();

    const result = await service.getList({
      fields: ['id', 'make'],
      limit: 20,
      q: { make: 'Toyota' },
      include: 'owner',
      resourcesJoinIds: { owner: 5 },
      searchDeletedRecords: true,
      customQueryBuilderOperation,
    });

    expect(queryService.getFrom).toHaveBeenCalledWith('cars', {
      fields: ['id', 'make'],
      limit: 20,
      query: { make: 'Toyota' },
      include: 'owner',
      resourcesJoinIds: { owner: 5 },
      searchDeletedRecords: true,
      customQueryBuilderOperation,
    });
    expect(result).toEqual(['row']);
  });

  it('insert should return first row from getFrom', async () => {
    const queryService = {
      insert: jest.fn().mockResolvedValue(42),
      getFrom: jest.fn().mockResolvedValue([{ id: 42, name: 'Test' }]),
    };
    const service = makeCRUDService({ queryService, resourceName: 'customers' });

    const result = await service.insert({ name: 'Test' });

    expect(queryService.insert).toHaveBeenCalledWith('customers', { name: 'Test' });
    expect(queryService.getFrom).toHaveBeenCalledWith('customers', { query: { id: 42 } });
    expect(result).toEqual({ id: 42, name: 'Test' });
  });

  it('orders a collection by an allow-listed query field', async () => {
    const queryService = { getFrom: jest.fn().mockResolvedValue([]) };
    const service = makeCRUDService({ queryService, resourceName: 'cars' });

    await service.getList({ orderBy: 'created_at', order: 'desc' });

    const [, { customQueryBuilderOperation }] = queryService.getFrom.mock.calls[0];
    const builderQuery = { orderBy: jest.fn() };
    customQueryBuilderOperation(builderQuery);
    expect(builderQuery.orderBy).toHaveBeenCalledWith('cars.created_at', 'desc');
  });

  it('uses the configured default when no order is requested', async () => {
    const queryService = { getFrom: jest.fn().mockResolvedValue([]) };
    const service = makeCRUDService({
      queryService,
      resourceName: 'service_orders',
      sortableFields: ['id'],
      defaultOrderBy: 'id',
      defaultOrder: 'desc',
    });

    await service.getList();

    const [, { customQueryBuilderOperation }] = queryService.getFrom.mock.calls[0];
    const builderQuery = { orderBy: jest.fn() };
    customQueryBuilderOperation(builderQuery);
    expect(builderQuery.orderBy).toHaveBeenCalledWith('service_orders.id', 'desc');
  });

  it('does not sort when an unsupported field is requested without a default', async () => {
    const queryService = { getFrom: jest.fn().mockResolvedValue([]) };
    const service = makeCRUDService({ queryService, resourceName: 'cars' });

    await service.getList({ orderBy: 'price', order: 'desc' });

    const [, { customQueryBuilderOperation }] = queryService.getFrom.mock.calls[0];
    expect(customQueryBuilderOperation).toBeUndefined();
  });

  it('insert should return undefined when getFrom returns empty list', async () => {
    const queryService = {
      insert: jest.fn().mockResolvedValue(7),
      getFrom: jest.fn().mockResolvedValue([]),
    };
    const service = makeCRUDService({ queryService, resourceName: 'customers' });

    const result = await service.insert({ name: 'Missing' });

    expect(queryService.insert).toHaveBeenCalledWith('customers', { name: 'Missing' });
    expect(queryService.getFrom).toHaveBeenCalledWith('customers', { query: { id: 7 } });
    expect(result).toBeUndefined();
  });

  it('update should forward params to queryService.update', async () => {
    const queryService = { update: jest.fn().mockResolvedValue({ id: 5, status: 'done' }) };
    const service = makeCRUDService({ queryService, resourceName: 'orders' });

    const result = await service.update(5, { status: 'done' });

    expect(queryService.update).toHaveBeenCalledWith('orders', { id: 5, status: 'done' });
    expect(result).toEqual({ id: 5, status: 'done' });
  });
});
