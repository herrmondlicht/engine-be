const getReports =
  ({ serviceReportService, queryBuilder }) =>
  async (req, res, next) => {
    try {
      const calculations = await serviceReportService.getServicePriceCalculation(queryBuilder);
      res.status(200).json({
        data: calculations,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

const makeUpdateServiceOrder = (CRUDControllerMethods) => (req, res, next) => {
  delete req.body.service_items_price;
  return CRUDControllerMethods.update(req, res, next);
};

export default ({ serviceReportService, queryBuilder, CRUDControllerMethods }) => ({
  getServicePriceCalculation: getReports({ serviceReportService, queryBuilder }),
  update: makeUpdateServiceOrder(CRUDControllerMethods),
});
