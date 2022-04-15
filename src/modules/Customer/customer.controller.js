import _CRUDControllerMethods from '../Common/common.controller';

export default ({ customerService, CRUDControllerMethods = _CRUDControllerMethods({ resourceService: customerService }) }) => ({
  ...CRUDControllerMethods,
});
