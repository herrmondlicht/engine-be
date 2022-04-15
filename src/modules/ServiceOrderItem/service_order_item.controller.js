import _CRUDControllerMethods from '../Common/common.controller';

export default ({ serviceOrderItemService, CRUDControllerMethods = _CRUDControllerMethods({ resourceService: serviceOrderItemService }) } = {}) => ({
  ...CRUDControllerMethods,
});
