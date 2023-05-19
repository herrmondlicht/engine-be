const getReports = ({serviceReportService, queryBuilder}) => async (req,res, next) => {
  try{
    const calculations = await serviceReportService.getServicePriceCalculation(queryBuilder)
    res.status(200).json(calculations)
  } catch(e){
    console.log(e)
    next(e);
  }

}


export default ({serviceReportService, queryBuilder}) => ({
  getServicePriceCalculation: getReports({serviceReportService, queryBuilder})
})