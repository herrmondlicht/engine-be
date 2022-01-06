import express from 'express';
import _serviceOrderPdfController from './serviceOrderPdf.controller';
import serviceOrderService from '../../services/serviceOrderService';
import serviceOrderItemsService from '../../services/serviceOrderItemService';
import customerCarService from '../../services/customerCarService';

const router = express.Router();

const serviceOrderPDFController = _serviceOrderPdfController({
  serviceOrderService: serviceOrderService(),
  serviceOrderItemsService: serviceOrderItemsService(),
  customerCarService: customerCarService(),
});

router.get('/:id', serviceOrderPDFController.byId);

export default router;
