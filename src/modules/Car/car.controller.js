
export default ({ carService }) => ({
  list: async (req, res, next) => {
    try {
      const carList = await carService.getList({ ...req.query });
      res.status(200).json({
        data: carList
      })
    }
    catch (e) {
      return respondError(res, e)
    }
  },
  byId: async (req, res, next) => {
    try {
      const carList = await carService.getList({ query: { id: req.params.id } });
      if (carList.length)
        res.status(200).json({
          data: carList[0]
        })
      else
        res.status(404).json({
          message: "resource was not found"
        })
    }
    catch (e) {
      return respondError(res, e)
    }
  },
  create: async (req, res) => {
    try {
      const { body } = req;
      const car = await carService.addCar(body)
      res.status(200).json({
        created: true,
        data: car[0]
      })
    }
    catch (e) {
      return respondError(res, e)
    }
  },
  update: (req, res) => {

  }
});



const respondError = (res, e) => {
  return res.status(500).json({
    status: 500,
    message: e.message || "something went wrong"
  })
}