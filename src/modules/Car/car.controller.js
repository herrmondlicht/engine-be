import commonControllerMethods, { respondError } from '../Common/common.controller';

export default ({ carService }) => ({
  ...commonControllerMethods({ resourceService: carService }),
  create: async (req, res) => {
    try {
      const { body } = req;
      const { updated_at, created_at, ...payload } = body;
      const car = await carService.insert(payload);
      return res.status(200).json({
        created: true,
        data: car[0],
      });
    } catch (e) {
      console.error(e);
      return respondError(res, e);
    }
  },
});
