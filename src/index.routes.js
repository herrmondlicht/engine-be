import express from 'express';
import jwt from 'express-jwt';
import loginRouter from './modules/Session/session.routes';
import carRouter from './modules/Car/car.routes';
import customerRoutes from './modules/Customer/customer.routes';
import customerCarRoutes from './modules/CustomerCar/customer_car.routes';

require('dotenv').config();

const { SECRET } = process.env;
const router = express.Router();

router.use('/session', loginRouter);
router.use('/cars', jwt({ secret: SECRET }), carRouter);
router.use('/customers', jwt({ secret: SECRET }), customerRoutes);
router.use('/customer_cars', jwt({ secret: SECRET }), customerCarRoutes);

export default router;
