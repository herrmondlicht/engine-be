import dbOperationsService from './dbOperationsService';

describe('dbOperationsService', () => {
  let queryBuilder = {
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  };

  const tableName = 'test_table';
  const data = { name: 'test', age: 20 };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insert', () => {
    it('should insert data into the table', async () => {
      const { insert } = dbOperationsService({ queryBuilder });

      await insert(tableName, data);

      expect(queryBuilder.insert).toHaveBeenCalledWith(data);
      expect(queryBuilder.into).toHaveBeenCalledWith(tableName);
    });
  });

  describe('update', () => {
    it('should update data in the table', async () => {
      const queryMethods = { where: jest.fn().mockReturnThis(), update: jest.fn().mockReturnThis() };
      const currentQueryBuilder = jest.fn().mockReturnValue(queryMethods);
      const { update } = dbOperationsService({ queryBuilder: currentQueryBuilder });

      const id = 1;
      const updateData = { name: 'updated', age: 30 };

      await update(tableName, { id, ...updateData });

      expect(currentQueryBuilder).toHaveBeenCalledWith(tableName);
      expect(queryMethods.where).toHaveBeenCalledWith({ id });
      expect(queryMethods.update).toHaveBeenCalledWith(updateData);
    });
  });
});
