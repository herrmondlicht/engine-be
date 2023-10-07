import express from 'express';

import bindResourcesToRoute from '../../middlewares/bindResourcesToRoute';
import serviceOrderItemRouter from '../ServiceOrderItem/service_order_item.routes';
import makeCRUDService from '../../services/makeCRUDService';
import makeServiceReportService from '../../services/serviceReport';
import makeCRUDController from '../Common/common.controller';
import { queryService } from '../../services/databaseService/queryService';
import queryBuilder from '../../services/databaseService/dbOperations/queryBuilder';
import makeServiceOrderController from './service_order.controller';

const router = express.Router();

const CRUDService = makeCRUDService({ queryService, resourceName: 'service_orders' });
const CRUDControllerMethods = makeCRUDController({ resourceService: CRUDService });
const serviceReportService = makeServiceReportService({ queryBuilder });
const serviceOrderController = makeServiceOrderController({ serviceReportService, queryBuilder });

router.get('/', CRUDControllerMethods.list);
router.post('/', CRUDControllerMethods.create);
router.get('/reports', serviceOrderController.getServicePriceCalculation);
router.patch('/:id', CRUDControllerMethods.update);
router.get('/:id', CRUDControllerMethods.byId);
router.delete('/:id', CRUDControllerMethods.delete);

router.use('/:id/items', bindResourcesToRoute('service_order_id', { cleanPreviousResources: true }), serviceOrderItemRouter);

export default router;
