import express from 'express';
import _customerCarController from './customer_car.controller';
import customerCarService from '../../services/customerCarService';

const router = express.Router();

const customerCarController = _customerCarController({ customerCarService: customerCarService() });

router.get('/', customerCarController.list);
router.post('/', customerCarController.create);
router.patch('/:id', customerCarController.update);
router.get('/:id', customerCarController.byId);
router.delete('/:id', customerCarController.delete);

export default router;
