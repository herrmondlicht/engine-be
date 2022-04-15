import _CRUDControllerMethods from '../Common/common.controller';

export default ({ serviceOrderService, CRUDControllerMethods = _CRUDControllerMethods({ resourceService: serviceOrderService }) } = {}) => ({
  ...CRUDControllerMethods,
});
