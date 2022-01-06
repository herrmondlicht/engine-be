import express from 'express';
import jwt from 'express-jwt';
import loginRouter from './modules/Session/session.routes';
import carRouter from './modules/Car/car.routes';
import customerRoutes from './modules/Customer/customer.routes';
import customerCarRoutes from './modules/CustomerCar/customer_car.routes';
import serviceOrderRoutes from './modules/ServiceOrder/service_order.routes';
import serviceOrderPdfRoutes from './modules/ServiceOrderPdf/serviceOrderPdf.routes';

require('dotenv').config();

const { SECRET } = process.env;
const router = express.Router();

router.use('/session', loginRouter);
router.use('/cars', jwt({ secret: SECRET, algorithms: ['HS256'] }), carRouter);
router.use('/customers', jwt({ secret: SECRET, algorithms: ['HS256'] }), customerRoutes);
router.use('/customer_cars', jwt({ secret: SECRET, algorithms: ['HS256'] }), customerCarRoutes);
router.use('/service_orders', jwt({ secret: SECRET, algorithms: ['HS256'] }), serviceOrderRoutes);
router.use('/service_orders_pdf', serviceOrderPdfRoutes);

export default router;
