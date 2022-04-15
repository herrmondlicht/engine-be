import sinon from 'sinon';

import { makeGetPrintableData } from './serviceOrderPDFService';

describe('Service Order PDF', () => {
  it('getePrintableData() should return data found by the repo functions', async () => {
    //GIVEN
    const CUSTOMER_CAR_ID = 1;
    const SERVICE_ORDER_ID = 2;
    const SERVICE_QUERY = { limit: 1, q: { id: CUSTOMER_CAR_ID }, include: 'cars,customers', searchDeletedRecord: true };

    const RESPONSE_CUSTOMER_CAR_SERVICE = 'car response';
    const RESPONSE_SERVICE_ITEMS = 'service items response';
    const dependencies = {
      customerCarService: {
        getList: sinon.stub().withArgs(sinon.match(SERVICE_QUERY)).resolves([RESPONSE_CUSTOMER_CAR_SERVICE]),
      },
      serviceOrderItemsService: {
        getList: sinon
          .stub()
          .withArgs(
            sinon.match({
              q: {
                service_order_id: SERVICE_ORDER_ID,
              },
            })
          )
          .resolves(RESPONSE_SERVICE_ITEMS),
      },
    };
    const getPritableData = makeGetPrintableData(dependencies);

    //when
    const result = await getPritableData({ customer_car_id: CUSTOMER_CAR_ID, service_order_id: SERVICE_ORDER_ID });

    //then
    expect(result).toStrictEqual([RESPONSE_CUSTOMER_CAR_SERVICE, RESPONSE_SERVICE_ITEMS]);
  });
});
