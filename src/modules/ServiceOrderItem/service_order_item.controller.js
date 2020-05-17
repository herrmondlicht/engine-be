import _commonControllerMethods from '../Common/common.controller';

export default ({ serviceOrderItemService, commonControllerMethods = _commonControllerMethods({ resourceService: serviceOrderItemService }) } = {}) => ({
  ...commonControllerMethods,
});
