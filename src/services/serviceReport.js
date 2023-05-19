const getServicePriceCalculation = ({queryBuilder}) => async () => {
      const calculations = await queryBuilder
      .from("service_orders")
      .select(queryBuilder.raw("month(created_at) as month"), queryBuilder.raw("year(created_at) as year"))
      .sum("service_price as service_price")
      .sum("discount_price as discount_price")                                             
      .sum("service_items_price as service_items_price")
      .groupBy("year")
      .groupBy("month")
      
      return calculations
  }

  export default ({queryBuilder}) => ({
    getServicePriceCalculation: getServicePriceCalculation({queryBuilder})
  })