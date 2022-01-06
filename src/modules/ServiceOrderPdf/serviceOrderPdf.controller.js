import html_to_pdf from 'html-pdf-node';
import ejs from 'ejs';
import { Readable } from 'stream';

export default ({ serviceOrderService, serviceOrderItemsService, customerCarService }) => ({
  byId: async (req, res) => {
    const [serviceOrderData] = await serviceOrderService.getList({
      limit: 1,
      q: {
        id: req.params.id,
      },
    });
    if (!serviceOrderData) {
      return res.sendStatus(404);
    }
    const [customerCarData, serviceItems] = await getPrintableData(serviceOrderData, { serviceOrderItemsService, customerCarService });
    if (!customerCarData) {
      return res.sendStatus(404);
    }
    const BASE_URL = `${req.protocol}://${req.get('host')}`;
    const printData = {
      ...customerCarData,
      service_items: serviceItems,
      service_orders: serviceOrderData,
      imagePath: `${BASE_URL}/brand_logo_square.png`,
    };
    try {
      const pdfStream = await generatePDFStream(printData);
      res.setHeader('Content-Type', 'application/pdf');
      pdfStream.pipe(res);
    } catch (e) {
      console.error(e);
      res.status(500).json({
        err: 500,
        message: 'PDF Stream not loaded',
      });
    }
  },
});

const generatePDFStream = (printData) =>
  new Promise((resolve, reject) => {
    ejs.renderFile(`${__dirname}/template/printTemplate.html`, printData, (err, htmlString) => {
      console.error(err);
      if (err) {
        return reject(err);
      }
      const file = { content: htmlString };
      const options = { format: 'A4' };
      html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
        const pdfStream = Readable.from(pdfBuffer);
        return resolve(pdfStream);
      });
    });
  });

const getPrintableData = async (serviceOrderData, { customerCarService, serviceOrderItemsService }) => {
  const customerCarDataPromise = customerCarService.getList({
    limit: 1,
    q: {
      id: serviceOrderData.customer_car_id,
    },
    include: 'cars,customers',
    searchDeletedRecords: true,
  });
  const serviceItemsPromise = serviceOrderItemsService.getList({
    q: {
      service_order_id: serviceOrderData.id,
    },
  });
  const [[customerCarsData], serviceItems] = await Promise.all([customerCarDataPromise, serviceItemsPromise]);
  return [customerCarsData, serviceItems];
};
