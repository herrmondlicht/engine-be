import commonService from './commonService';

export default () => ({
  ...commonService({ resourceName: 'customers' }),
});
