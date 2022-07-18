import express from 'express';
import html_to_pdf from 'html-pdf-node';
import ejs from 'ejs';
import { Readable } from 'stream';
import path from 'path';

import makeServiceOrderPdfController from './serviceOrderPdf.controller';
import makeServiceOrderService from '../../services/serviceOrderService';
import makeCustomerCarService from '../../services/customerCarService';
import { queryService } from '../../services/databaseService/queryService';
import queryBuilder from '../../services/databaseService/dbOperations/queryBuilder';

import { makeGetPrintableData, makeGetSanitizedServiceOrderData } from './services/serviceOrderPDFService';
import { makeGetPDFStream } from '../../services/pdfGenerator/pdfGenerator';
import makeCRUDService from '../../services/makeCRUDService';

const router = express.Router();

// Set dependencies for controller
const getPDFStream = makeGetPDFStream({ StreamReader: Readable, htmlRenderer: ejs, pdfGenerator: html_to_pdf, resolvePath: path.resolve });
const customerCarCRUDService = makeCRUDService({ queryService, resourceName: 'customer_cars' });
const serviceOrdersCRUDService = makeCRUDService({ queryService, resourceName: 'service_orders' });
const serviceOrderItemsCRUDService = makeCRUDService({ queryService, resourceName: 'service_order_items' });

const getPrintableData = makeGetPrintableData({
  customerCarService: makeCustomerCarService({ CRUDService: customerCarCRUDService }),
  serviceOrderItemsService: serviceOrderItemsCRUDService,
});

const getSanitizedServiceOrderData = makeGetSanitizedServiceOrderData();

// Set controller for route
const serviceOrderPDFController = makeServiceOrderPdfController({
  getSanitizedServiceOrderData,
  getPrintableData,
  getPDFStream,
  serviceOrderService: makeServiceOrderService({ commonService: serviceOrdersCRUDService, queryBuilder, queryService }),
  resolvePath: path.resolve,
});

router.get('/:id', serviceOrderPDFController.byId);

export default router;
