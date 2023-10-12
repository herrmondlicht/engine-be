import makeCRUDService from './makeCRUDService';

describe('makeCRUDService', () => {
  const queryService = {
    getFrom: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
  };
  const resourceName = 'testResource';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('should call queryService.getFrom with correct arguments', async () => {
      const fields = ['field1', 'field2'];
      const limit = 10;
      const q = { field3: 'value3' };
      const include = ['include1', 'include2'];
      const resourcesJoinIds = [1, 2, 3];
      const searchDeletedRecords = true;

      const service = makeCRUDService({ queryService, resourceName });
      await service.getList({ fields, limit, q, include, resourcesJoinIds, searchDeletedRecords });

      expect(queryService.getFrom).toHaveBeenCalledWith(resourceName, { fields, limit, query: q, include, resourcesJoinIds, searchDeletedRecords });
    });

    it('should call queryService.getFrom with default arguments', async () => {
      const service = makeCRUDService({ queryService, resourceName });
      await service.getList();

      expect(queryService.getFrom).toHaveBeenCalledWith(resourceName, {});
    });
  });

  describe('insert', () => {
    it('should call queryService.insert and queryService.getFrom with correct arguments', async () => {
      const data = { field1: 'value1', field2: 'value2' };
      const id = 1;
      const selectFromInsert = [{ id, ...data }];

      queryService.insert.mockReturnValue(id);
      queryService.getFrom.mockReturnValue(selectFromInsert);

      const service = makeCRUDService({ queryService, resourceName });
      const result = await service.insert(data);

      expect(queryService.insert).toHaveBeenCalledWith(resourceName, data);
      expect(queryService.getFrom).toHaveBeenCalledWith(resourceName, { query: { id } });
      expect(result).toEqual(selectFromInsert[0]);
    });
  });

  describe('update', () => {
    it('should call queryService.update with correct arguments', async () => {
      const updateId = 1;
      const data = { field1: 'value1', field2: 'value2' };

      const service = makeCRUDService({ queryService, resourceName });
      await service.update(updateId, data);

      expect(queryService.update).toHaveBeenCalledWith(resourceName, { id: updateId, ...data });
    });
  });
});
