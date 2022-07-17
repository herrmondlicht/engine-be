export default ({ CRUDService }) => ({
  ...CRUDService,
  insert: ({ license_plate, ...data }) => {
    return CRUDService.insert({ license_plate: license_plate.toString().replace('-', ''), ...data });
  },
});
