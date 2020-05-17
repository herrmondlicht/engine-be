import express from 'express';

import _customerCarController from './customer_car.controller';
import customerCarService from '../../services/customerCarService';
import bindResourcesToRoute from '../../middlewares/bindResourcesToRoute';
import serviceOrderRouter from '../ServiceOrder/service_order.routes';

const router = express.Router();

const customerCarController = _customerCarController({ customerCarService: customerCarService() });

router.get('/', customerCarController.list);
router.post('/', customerCarController.create);
router.patch('/:id', customerCarController.update);
router.get('/:id', customerCarController.byId);
router.delete('/:id', customerCarController.delete);

router.use('/:id/services', bindResourcesToRoute('customer_car_id', { cleanPreviousResources: true }), serviceOrderRouter);

export default router;
