import _commonService from './commonService';

export default ({ commonService = _commonService({ resourceName: 'customers' }) } = {}) => ({
  ...commonService,
});
