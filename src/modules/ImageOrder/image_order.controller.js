export default ({ service }) => ({
  async create(req, res, next) {
    try {
      const { image } = req.body;
      const result = await service.processImage(image);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  },
});
