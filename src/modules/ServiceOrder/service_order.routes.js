import express from 'express';

import bindResourcesToRoute from '../../middlewares/bindResourcesToRoute';
import makeServiceOrderService from '../../services/serviceOrderService';
import serviceOrderItemRouter from '../ServiceOrderItem/service_order_item.routes';
import makeCRUDService from '../../services/makeCRUDService';
import makeCRUDController from '../Common/common.controller';
import { queryService } from '../../services/databaseService/queryService';
import queryBuilder from '../../services/databaseService/dbOperations/queryBuilder';

const router = express.Router();

const CRUDService = makeCRUDService({ queryService, resourceName: 'service_orders' });
const serviceOrderService = makeServiceOrderService({ commonService: CRUDService, queryBuilder, queryService });
const CRUDControllerMethods = makeCRUDController({ resourceService: serviceOrderService });

router.get('/', CRUDControllerMethods.list);
router.post('/', CRUDControllerMethods.create);
router.patch('/:id', CRUDControllerMethods.update);
router.get('/:id', CRUDControllerMethods.byId);
router.delete('/:id', CRUDControllerMethods.delete);

router.use('/:id/items', bindResourcesToRoute('service_order_id', { cleanPreviousResources: true }), serviceOrderItemRouter);

export default router;
