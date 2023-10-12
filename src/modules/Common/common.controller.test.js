import makeController from './common.controller';
import { advanceTo } from 'jest-date-mock';

describe('Common Controller', () => {
  const mockResourceService = {
    getList: jest.fn(),
    getById: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const controller = makeController({ resourceService: mockResourceService });

  afterEach(() => {
    advanceTo(new Date(2021, 1, 1));
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should call resourceService.list and return the result', async () => {
      const mockListResult = [{ id: 1, name: 'Resource 1' }];
      mockResourceService.getList.mockResolvedValue(mockListResult);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.list(req, res, next);

      expect(mockResourceService.getList).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ data: mockListResult });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if resourceService.list throws an error', async () => {
      const mockError = new Error('Resource Service Error');
      mockResourceService.getList.mockRejectedValue(mockError);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.list(req, res, next);

      expect(mockResourceService.getList).toHaveBeenCalledTimes(1);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('byId', () => {
    it('should call resourceService.getById with the correct id and return the result', async () => {
      const mockGetByListResult = [{ id: 1, name: 'Resource 1' }];
      const expectedResult = { data: mockGetByListResult[0] };
      mockResourceService.getList.mockResolvedValue(mockGetByListResult);

      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.byId(req, res, next);

      expect(mockResourceService.getList).toHaveBeenCalledTimes(1);
      expect(mockResourceService.getList).toHaveBeenCalledWith({ q: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if resourceService.getById throws an error', async () => {
      const mockError = new Error('Resource Service Error');
      mockResourceService.getList.mockRejectedValue(mockError);

      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.byId(req, res, next);

      expect(mockResourceService.getList).toHaveBeenCalledTimes(1);
      expect(mockResourceService.getList).toHaveBeenCalledWith({ q: { id: 1 } });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('create', () => {
    it('should call resourceService.create with the correct data and return the result', async () => {
      const expectedCallToCreate = { name: 'Resource 1' };
      const expectedSQLResponse = { id: 1, name: 'Resource 1' };
      const mockCreateResult = { created: true, data: expectedSQLResponse };
      mockResourceService.insert.mockResolvedValue(expectedSQLResponse);

      const req = {
        body: {
          created_at: new Date(),
          updated_at: new Date(),
          name: 'Resource 1',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.create(req, res, next);

      expect(mockResourceService.insert).toHaveBeenCalledTimes(1);
      expect(mockResourceService.insert).toHaveBeenCalledWith(expectedCallToCreate);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockCreateResult);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if resourceService.create throws an error', async () => {
      const mockError = new Error('Resource Service Error');
      mockResourceService.insert.mockRejectedValue(mockError);

      const req = {
        body: {
          name: 'Resource 1',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.create(req, res, next);

      expect(mockResourceService.insert).toHaveBeenCalledTimes(1);
      expect(mockResourceService.insert).toHaveBeenCalledWith({ name: 'Resource 1' });
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('update', () => {
    it('should call resourceService.update with the correct id and data and return the result', async () => {
      const mockUpdateResult = { id: 1, name: 'Resource 1' };
      mockResourceService.update.mockResolvedValue(mockUpdateResult);

      const req = {
        params: {
          id: 1,
        },
        body: {
          name: 'Resource 1',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.update(req, res, next);

      expect(mockResourceService.update).toHaveBeenCalledTimes(1);
      expect(mockResourceService.update).toHaveBeenCalledWith(1, { name: 'Resource 1' });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ updated: true, data: mockUpdateResult });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if resourceService.update throws an error', async () => {
      const mockError = new Error('Resource Service Error');
      mockResourceService.update.mockRejectedValue(mockError);

      const req = {
        params: {
          id: 1,
        },
        body: {
          name: 'Resource 1',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.update(req, res, next);

      expect(mockResourceService.update).toHaveBeenCalledTimes(1);
      expect(mockResourceService.update).toHaveBeenCalledWith(1, { name: 'Resource 1' });
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('delete', () => {
    it('should call resourceService.delete with the correct id and return a success message', async () => {
      const resource = { id: 1, name: 'Resource 1' };
      mockResourceService.update.mockResolvedValue(resource);

      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.delete(req, res, next);

      expect(mockResourceService.update).toHaveBeenCalledTimes(1);
      expect(mockResourceService.update).toHaveBeenCalledWith(req.params.id, { deleted_at: new Date() });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ deleted: true, data: resource });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if resourceService.delete throws an error', async () => {
      const mockError = new Error('Resource Service Error');
      mockResourceService.update.mockRejectedValue(mockError);

      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await controller.delete(req, res, next);

      expect(mockResourceService.update).toHaveBeenCalledWith(req.params.id, { deleted_at: new Date() });
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
