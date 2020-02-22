
export default ({ carService }) => ({
  list: async (req, res, next) => {
    try {
      const carList = await carService.getList({...req.query});
      res.status(200).json({
        data: carList
      })
    }
    catch (e) {
      res.status(500).json({
        status:500,
        message: "something went wrong"
      })
    }
  },
  create: (req, res) => {
    res.status(200).json({
      created: true,
      message: "grrrrreat job"
    })
  },
  update: (req, res) => {

  }
});
