import bindResourcesToRoute from './bindResourcesToRoute';

describe('bindResourcesToRoute', () => {
  const rootResourceIdKey = 'customer_id';
  let middleware;
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: { id: '123' },
      resourcesJoinIds: { car_id: '1' },
    };
    res = {}; // We won't use res in this middleware
    next = jest.fn(); // Mock the next function
  });

  test('should add the resource id to req.resourcesJoinIds', () => {
    middleware = bindResourcesToRoute(rootResourceIdKey);
    middleware(req, res, next);

    expect(req.resourcesJoinIds).toEqual({
      car_id: '1',
      customer_id: '123',
    });
    expect(next).toHaveBeenCalled();
  });

  test('should clean previous resources when cleanPreviousResources is true', () => {
    middleware = bindResourcesToRoute(rootResourceIdKey, { cleanPreviousResources: true });
    middleware(req, res, next);

    expect(req.resourcesJoinIds).toEqual({
      customer_id: '123',
    });
    expect(next).toHaveBeenCalled();
  });

  test('should not clean previous resources when cleanPreviousResources is false', () => {
    middleware = bindResourcesToRoute(rootResourceIdKey, { cleanPreviousResources: false });
    middleware(req, res, next);

    expect(req.resourcesJoinIds).toEqual({
      car_id: '1',
      customer_id: '123',
    });
    expect(next).toHaveBeenCalled();
  });

  test('should work even if req.resourcesJoinIds is undefined', () => {
    req.resourcesJoinIds = undefined;
    middleware = bindResourcesToRoute(rootResourceIdKey);
    middleware(req, res, next);

    expect(req.resourcesJoinIds).toEqual({
      customer_id: '123',
    });
    expect(next).toHaveBeenCalled();
  });
});
