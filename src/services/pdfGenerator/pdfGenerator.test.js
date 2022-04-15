import { makeGetPDFStream } from './pdfGenerator';
import sinon from 'sinon';

describe('Pdf Generator Service', () => {
  it('getPDFStream() should return pdf stream', async () => {
    // GIVEN
    const PRINT_DATA = { name: 'GS' };
    const PATH = '../path';
    const HTML_STRING = '<html></html>';
    const PDF_BUFFER = 'p..d..f';
    const PDF_STREAM = 'pdf';
    const dependencies = {
      htmlRenderer: {
        renderFile: (path, printData, fn) => {
          expect(path).toEqual(PATH);
          expect(printData).toEqual(PRINT_DATA);
          fn(false, HTML_STRING);
        },
      },
      pdfGenerator: {
        generatePdf: sinon.stub().resolves(PDF_BUFFER),
      },
      StreamReader: {
        from: sinon.stub().withArgs(PDF_BUFFER).resolves(PDF_STREAM),
      },
    };
    const getPDFStream = makeGetPDFStream(dependencies);

    //WHEN

    const generatedPDF = await getPDFStream(PRINT_DATA, PATH);

    //THEN
    const generatePdfFirstArgument = dependencies.pdfGenerator.generatePdf.getCalls(0)[0].firstArg;
    expect(generatePdfFirstArgument).toEqual({ content: HTML_STRING });
    expect(generatedPDF).toEqual(PDF_STREAM);
  });
});
