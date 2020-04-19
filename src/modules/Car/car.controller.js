import commonControllerMethods from '../Common/common.controller';

export const respondError = (res, e) =>
  res.status(500).json({
    status: 500,
    message: e.message || 'something went wrong',
  });

export default ({ carService }) => ({
  ...commonControllerMethods({ resourceService: carService }),
  create: async (req, res) => {
    try {
      const { body } = req;
      const car = await carService.insert(body);
      return res.status(200).json({
        created: true,
        data: car[0],
      });
    } catch (e) {
      return respondError(res, e);
    }
  },
});
