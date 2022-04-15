import _CRUDControllerMethods from '../Common/common.controller';

export default ({ customerCarService, CRUDControllerMethods = _CRUDControllerMethods({ resourceService: customerCarService }) } = {}) => ({
  ...CRUDControllerMethods,
});
