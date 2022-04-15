import express from 'express';
import html_to_pdf from 'html-pdf-node';
import ejs from 'ejs';
import { Readable } from 'stream';
import path from 'path';

import makeServiceOrderPdfController from './serviceOrderPdf.controller';
import makeServiceOrderService from '../../services/serviceOrderService';
import makeServiceOrderItemsService from '../../services/serviceOrderItemService';
import makeCustomerCarService from '../../services/customerCarService';

import { makeGetPrintableData } from './services/serviceOrderPDFService';
import { makeGetPDFStream } from '../../services/pdfGenerator/pdfGenerator';

const router = express.Router();

// Set dependencies for controller
const getPDFStream = makeGetPDFStream({ StreamReader: Readable, htmlRenderer: ejs, pdfGenerator: html_to_pdf, resolvePath: path.resolve });

const getPrintableData = makeGetPrintableData({
  customerCarService: makeCustomerCarService(),
  serviceOrderItemsService: makeServiceOrderItemsService(),
});

// Set controller for route
const serviceOrderPDFController = makeServiceOrderPdfController({
  getPrintableData,
  getPDFStream,
  serviceOrderService: makeServiceOrderService(),
  resolvePath: path.resolve,
});

router.get('/:id', serviceOrderPDFController.byId);

export default router;
