import express from 'express';

import makeCustomerController from './customer.controller';
import makeCRUDControllerMethods from '../Common/common.controller';
import makeCRUDService from '../../services/makeCRUDService';
import customerCarRoutes from '../CustomerCar/customer_car.routes';
import bindResourcesToRoute from '../../middlewares/bindResourcesToRoute';
import { queryService } from '../../services/databaseService/queryService';

const router = express.Router();

const CRUDService = makeCRUDService({ queryService, resourceName: 'customers' });
const CRUDControllerMethods = makeCRUDControllerMethods({ resourceService: CRUDService });
const customerController = makeCustomerController({ CRUDControllerMethods });

router.get('/', customerController.list);
router.post('/', customerController.create);
router.patch('/:id', customerController.update);
router.get('/:id', customerController.byId);
router.delete('/:id', customerController.delete);

router.use('/:id/cars', bindResourcesToRoute('customer_id'), customerCarRoutes);

export default router;
