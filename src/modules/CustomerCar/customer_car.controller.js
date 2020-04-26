import _commonControllerMethods from '../Common/common.controller';

export default ({ customerCarService, commonControllerMethods = _commonControllerMethods({ resourceService: customerCarService }) } = {}) => ({
  ...commonControllerMethods,
});
