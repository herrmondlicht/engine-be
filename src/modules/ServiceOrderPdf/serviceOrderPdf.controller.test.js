import sinon from 'sinon';
import makeServiceOrderPdfController from './serviceOrderPdf.controller';

describe('Service Order PDF Controller', () => {
  const RESPONSES = {
    SERVICE_ORDER: { baz: 'baz' },
    PRINTABLE_DATA: [{ foo: 'foo' }, { bar: 'bar' }],
    GET_PDF_STREAM: { pipe: sinon.stub() },
    RESOLVE_PATH: 'resolved/path',
  };
  const req = {
    params: {
      id: 2,
    },
  };
  const res = {
    send: sinon.stub(),
    setHeader: sinon.stub(),
  };

  let dependencies = {
    getPrintableData: sinon.stub().resolves(RESPONSES.PRINTABLE_DATA),
    getPDFStream: sinon.stub().resolves(RESPONSES.GET_PDF_STREAM),
    serviceOrderService: { getList: sinon.stub().resolves([RESPONSES.SERVICE_ORDER]) },
    resolvePath: sinon.stub().returns(RESPONSES.RESOLVE_PATH),
  };

  it('byId() should call generatePDF stream with right data', async () => {
    //GIVEN
    const serviceOrderPdfController = makeServiceOrderPdfController(dependencies);

    //WHEN

    await serviceOrderPdfController.byId(req, res);

    //THEN
    const { getPrintableData, getPDFStream, serviceOrderService } = dependencies;

    sinon.assert.calledWithExactly(serviceOrderService.getList, {
      limit: 1,
      q: {
        id: req.params.id,
      },
    });

    const getPrintableDataParam = {
      ...RESPONSES.PRINTABLE_DATA[0],
      service_items: RESPONSES.PRINTABLE_DATA[1],
      service_orders: RESPONSES.SERVICE_ORDER,
    };

    sinon.assert.calledWithExactly(getPrintableData, RESPONSES.SERVICE_ORDER);
    sinon.assert.calledWith(getPDFStream, getPrintableDataParam);
    sinon.assert.calledWithExactly(RESPONSES.GET_PDF_STREAM.pipe, res);
  });
});
