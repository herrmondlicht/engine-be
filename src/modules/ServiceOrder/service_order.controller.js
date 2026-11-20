const getReports =
  ({ serviceReportService }) =>
  async (req, res, next) => {
    try {
      const [calculations, yearToDate] = await Promise.all([serviceReportService.getServicePriceCalculation(), serviceReportService.getYearToDateTotals()]);
      res.status(200).json({
        data: calculations,
        yearToDate,
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

export default ({ serviceReportService, CRUDControllerMethods }) => ({
  getServicePriceCalculation: getReports({ serviceReportService }),
  update: makeUpdateServiceOrder(CRUDControllerMethods),
});
