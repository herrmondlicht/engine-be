export const makeGetPDFStream =
  ({ pdfGenerator, htmlRenderer, StreamReader }) =>
  (printData, templateURL) => {
    return new Promise((resolve, reject) => {
      htmlRenderer.renderFile(templateURL, printData, (err, htmlString) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        const file = { content: htmlString };
        const options = { format: 'A4' };
        pdfGenerator.generatePdf(file, options).then((pdfBuffer) => {
          const pdfStream = StreamReader.from(pdfBuffer);
          return resolve(pdfStream);
        });
      });
    });
  };
