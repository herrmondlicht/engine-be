import makeCRUDService from './makeCRUDService';

describe('makeCRUDService', () => {
  it('getList should forward params to queryService.getFrom', async () => {
    const queryService = { getFrom: jest.fn().mockResolvedValue(['row']) };
    const service = makeCRUDService({ queryService, resourceName: 'cars' });

    const result = await service.getList({
      fields: ['id', 'make'],
      limit: 20,
      q: { make: 'Toyota' },
      include: 'owner',
      resourcesJoinIds: { owner: 5 },
      searchDeletedRecords: true,
    });

    expect(queryService.getFrom).toHaveBeenCalledWith('cars', {
      fields: ['id', 'make'],
      limit: 20,
      query: { make: 'Toyota' },
      include: 'owner',
      resourcesJoinIds: { owner: 5 },
      searchDeletedRecords: true,
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
