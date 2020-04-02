const respondError = (res, e) =>
  res.status(500).json({
    status: 500,
    message: e.message || 'something went wrong',
  });

export default ({ carService }) => ({
  list: async (req, res) => {
    try {
      const carList = await carService.getList({ ...req.query });
      return res.status(200).json({
        data: carList,
      });
    } catch (e) {
      return respondError(res, e);
    }
  },
  byId: async (req, res) => {
    try {
      const carList = await carService.getList({ query: { id: req.params.id } });
      if (carList.length) {
        return res.status(200).json({
          data: carList[0],
        });
      }
      return res.status(404).json({
        message: 'resource was not found',
      });
    } catch (e) {
      return respondError(res, e);
    }
  },
  create: async (req, res) => {
    try {
      const { body } = req;
      const car = await carService.addCar(body);
      return res.status(200).json({
        created: true,
        data: car[0],
      });
    } catch (e) {
      return respondError(res, e);
    }
  },
  update: () => {},
});
