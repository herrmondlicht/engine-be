import express from 'express';
import axios from 'axios';
import makeCRUDService from '../../services/makeCRUDService';
import makeCustomerCarService from '../../services/customerCarService';
import makeServiceOrderService from '../../services/serviceOrderService';
import makeServiceOrderItemsService from '../../services/serviceOrderItemsService';
import { queryService } from '../../services/databaseService/queryService';
import queryBuilder from '../../services/databaseService/dbOperations/queryBuilder';
import { makeOpenAIVisionService } from '../../services/openai/openAIVisionService';
import makeProcessImageService from '../../services/openai/serviceOrderFromImageService';
import makeController from './image_order.controller';

const router = express.Router();

const customerCarCRUD = makeCRUDService({ queryService, resourceName: 'customer_cars' });
const serviceOrderCRUD = makeCRUDService({ queryService, resourceName: 'service_orders' });
const serviceOrderItemsCRUD = makeCRUDService({ queryService, resourceName: 'service_order_items' });

const service = makeProcessImageService({
  openAIVisionService: makeOpenAIVisionService({ openAIKey: process.env.OPENAI_API_KEY, fetchInstance: axios }),
  customerCarService: makeCustomerCarService({ CRUDService: customerCarCRUD }),
  serviceOrderService: makeServiceOrderService({ commonService: serviceOrderCRUD, queryService, queryBuilder }),
  serviceOrderItemsService: makeServiceOrderItemsService({ commonService: serviceOrderItemsCRUD, queryService, queryBuilder }),
});

const controller = makeController({ service });

router.post('/', controller.create);

export default router;
