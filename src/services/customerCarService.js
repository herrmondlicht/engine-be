import commonService from './commonService';

export default () => ({
  ...commonService({ resourceName: 'customer_cars' }),
});
