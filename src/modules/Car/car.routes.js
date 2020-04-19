import express from 'express';
import _carController from './car.controller';
import carService from '../../services/carService';

const router = express.Router();

const carController = _carController({ carService: carService() });

router.get('/', carController.list);
router.post('/', carController.create);
router.get('/:id', carController.byId);

export default router;
