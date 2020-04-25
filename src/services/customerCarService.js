import _commonService from './commonService';

export default ({ commonService = _commonService({ resourceName: 'customer_cars' }) } = {}) => ({
  ...commonService,
  insert: ({ license_plate, ...data }) => {
    return commonService.insert({ license_plate: license_plate.toString().replace('-', ''), ...data });
  },
});
