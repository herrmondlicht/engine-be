import express from 'express';

import _customerController from './customer.controller';
import customerService from '../../services/customerService';
import customerCarRoutes from '../CustomerCar/customer_car.routes';
import bindResourcesToRoute from '../../middlewares/bindResourcesToRoute';

const router = express.Router();

const customerController = _customerController({ customerService: customerService() });

router.get('/', customerController.list);
router.post('/', customerController.create);
router.patch('/:id', customerController.update);
router.get('/:id', customerController.byId);
router.delete('/:id', customerController.delete);

router.use('/:id/cars', bindResourcesToRoute(['cars', 'customers'], 'customer_id'), customerCarRoutes);

export default router;
