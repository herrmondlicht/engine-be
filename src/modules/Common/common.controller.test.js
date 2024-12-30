import commonController from './common.controller';

describe('Common Controller', () => {
  describe('list', () => {
    it('should return a list of resources', async () => {
      const resourceService = {
        getList: jest.fn().mockResolvedValue([
          { id: 1, name: 'Resource 1' },
          { id: 2, name: 'Resource 2' },
        ]),
      };
      const req = {
        query: {},
        resourcesJoinIds: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const controller = commonController({ resourceService });
      await controller.list(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          { id: 1, name: 'Resource 1' },
          { id: 2, name: 'Resource 2' },
        ],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if an exception occurs', async () => {
      const resourceService = {
        getList: jest.fn().mockImplementation(() => {
          throw new Error('Service error');
        }),
      };
      const req = {};
      const res = {};
      const next = jest.fn();

      const controller = commonController({ resourceService });
      await controller.list(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('byId', () => {
    it('should return a resource by id', async () => {
      const resourceService = {
        getList: jest.fn().mockResolvedValue([{ id: 1, name: 'Resource 1' }]),
      };
      const req = {
        params: {
          id: 1,
        },
        resourcesJoinIds: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const controller = commonController({ resourceService });
      await controller.byId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: { id: 1, name: 'Resource 1' } });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if resource is not found', async () => {
      const resourceService = {
        getList: jest.fn().mockResolvedValue([]),
      };
      const req = {
        params: {
          id: 1,
        },
        resourcesJoinIds: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const controller = commonController({ resourceService });
      await controller.byId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'resource was not found' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if an exception occurs', async () => {
      const resourceService = {
        getList: jest.fn().mockImplementation(() => {
          throw new Error('Service error');
        }),
      };
      const req = {};
      const res = {};
      const next = jest.fn();

      const controller = commonController({ resourceService });
      await controller.byId(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
