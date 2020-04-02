import express from 'express';
import CarController from './car.controller';
import CarService from '../../services/CarService';

const router = express.Router();

const carService = CarService();
const carController = CarController({ carService });


router.get('/', carController.list);
router.post('/', carController.create);
router.put('/', carController.update);
router.get('/:id', carController.byId);

export default router;
