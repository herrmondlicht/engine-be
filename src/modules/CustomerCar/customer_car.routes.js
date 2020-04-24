import express from 'express';
import _customerCarController from './customer_car.controller';
import customerService from '../../services/customerService';

const router = express.Router();

const customerCarController = _customerCarController({ customerService: customerService() });

router.get('/', customerCarController.list);
router.post('/', customerCarController.create);
router.patch('/:id', customerCarController.update);
router.get('/:id', customerCarController.byId);
router.delete('/:id', customerCarController.delete);

export default router;
