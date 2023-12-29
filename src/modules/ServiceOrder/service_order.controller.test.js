import serviceOrderController from './service_order.controller';

describe('Service Order Controller', () => {
  describe('getServicePriceCalculation', () => {
    it('should return service price reports', async () => {
      const serviceReportService = {
        getServicePriceCalculation: jest.fn().mockResolvedValue({ calculations: 100 }),
      };
      const queryBuilder = {};
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await serviceOrderController({ serviceReportService, queryBuilder }).getServicePriceCalculation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: { calculations: 100 } });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if an exception occurs', async () => {
      const serviceReportService = {
        getServicePriceCalculation: jest.fn().mockImplementation(() => {
          throw new Error('Service error');
        }),
      };
      const queryBuilder = {};
      const req = {};
      const res = {};
      const next = jest.fn();

      await serviceOrderController({ serviceReportService, queryBuilder }).getServicePriceCalculation(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('update', () => {
    it('should delete service_items_price from request body', () => {
      const CRUDControllerMethods = {
        update: jest.fn(),
      };
      const req = {
        body: {
          service_items_price: 100,
        },
      };
      const res = {};
      const next = jest.fn();

      serviceOrderController({ CRUDControllerMethods }).update(req, res, next);

      expect(req.body.service_items_price).toBeUndefined();
      expect(CRUDControllerMethods.update).toHaveBeenCalledWith(req, res, next);
    });
  });
});
