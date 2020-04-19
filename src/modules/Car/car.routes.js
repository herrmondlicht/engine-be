import express from 'express';
import CarController from './car.controller';
import carService from '../../services/carService';

const router = express.Router();

const carController = CarController({ carService: carService() });

router.get('/', carController.list);
router.post('/', carController.create);
router.get('/:id', carController.byId);

export default router;
