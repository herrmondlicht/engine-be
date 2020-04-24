import commonControllerMethods from '../Common/common.controller';

export default ({ customerCarService }) => ({
  ...commonControllerMethods({ resourceService: customerCarService }),
});
