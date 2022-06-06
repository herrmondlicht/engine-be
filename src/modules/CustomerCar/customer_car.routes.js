import express from 'express';

import makeCRUDService from '../../services/makeCRUDService';
import makeCustomerCarService from '../../services/customerCarService';
import { queryService } from '../../services/databaseService/queryService';
import makeCustomerCarController from './customer_car.controller';
import makeCRUDController from '../Common/common.controller';
import bindResourcesToRoute from '../../middlewares/bindResourcesToRoute';
import serviceOrderRouter from '../ServiceOrder/service_order.routes';

const router = express.Router();

const CRUDService = makeCRUDService({ queryService, resourceName: 'customer_cars' });
const customerCarService = makeCustomerCarService({ CRUDService });
const CRUDControllerMethods = makeCRUDController({ resourceService: customerCarService });

const customerCarController = makeCustomerCarController({
  CRUDControllerMethods,
});

router.get('/', customerCarController.list);
router.post('/', customerCarController.create);
router.patch('/:id', customerCarController.update);
router.get('/:id', customerCarController.byId);
router.delete('/:id', customerCarController.delete);

router.use('/:id/services', bindResourcesToRoute('customer_car_id', { cleanPreviousResources: true }), serviceOrderRouter);

export default router;
