export default ({ getPrintableData, serviceOrderService, getPDFStream, resolvePath }) => ({
  byId: async (req, res) => {
    const [serviceOrderData] = await serviceOrderService.getList({
      limit: 1,
      q: {
        id: req.params.id,
      },
    });

    if (!serviceOrderData) return res.send(404);

    const [customerCarData, serviceItems] = await getPrintableData(serviceOrderData);
    const templateURL = resolvePath(__dirname, '../../template/printTemplate.html');

    const printData = {
      ...customerCarData,
      service_items: serviceItems,
      service_orders: serviceOrderData,
    };
    try {
      const pdfStream = await getPDFStream(printData, templateURL);
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
