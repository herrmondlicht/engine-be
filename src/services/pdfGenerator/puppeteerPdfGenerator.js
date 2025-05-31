import puppeteer from 'puppeteer';

export const puppeteerPdfGenerator = {
  async generatePdf(file, options = {}) {
    let browser;

    try {
      // Launch browser with optimized settings for PDF generation
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      });

      const page = await browser.newPage();

      // Set content from the file object
      await page.setContent(file.content, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
      });

      // Configure PDF options with defaults
      const pdfOptions = {
        format: options.format || 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
        ...options,
      };

      // Generate PDF buffer and ensure it's a proper Buffer
      const pdfBuffer = await page.pdf(pdfOptions);

      // Ensure we return a proper Node.js Buffer
      return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF with Puppeteer:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  },
};
