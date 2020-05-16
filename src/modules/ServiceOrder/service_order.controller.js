import _commonControllerMethods from '../Common/common.controller';

export default ({ serviceOrderService, commonControllerMethods = _commonControllerMethods({ resourceService: serviceOrderService }) } = {}) => ({
  ...commonControllerMethods,
});
