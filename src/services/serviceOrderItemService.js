import _commonService from './commonService';

export default ({ commonService = _commonService({ resourceName: 'service_order_items' }) } = {}) => ({
  ...commonService,
});
