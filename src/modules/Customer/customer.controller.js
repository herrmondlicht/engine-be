import commonControllerMethods from '../Common/common.controller';

export default ({ customerService }) => ({
  ...commonControllerMethods({ resourceService: customerService }),
});
