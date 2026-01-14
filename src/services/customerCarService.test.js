import customerCarService from './customerCarService';

describe('customerCarService', () => {
  it('should normalize license_plate before insert', async () => {
    const insert = jest.fn();
    const CRUDService = { insert };
    const service = customerCarService({ CRUDService });

    await service.insert({ license_plate: 'AB-123', owner_id: 10 });

    expect(insert).toHaveBeenCalledWith({ license_plate: 'AB123', owner_id: 10 });
  });

  it('should preserve other fields while normalizing license_plate', async () => {
    const insert = jest.fn();
    const CRUDService = { insert };
    const service = customerCarService({ CRUDService });

    await service.insert({ license_plate: 98765, color: 'red', active: true });

    expect(insert).toHaveBeenCalledWith({ license_plate: '98765', color: 'red', active: true });
  });
});
