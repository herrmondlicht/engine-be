import express from 'express';
import jwt from 'express-jwt';
import loginRouter from './modules/Session/session.routes';
import carRouter from './modules/Car/car.routes';

require('dotenv').config();

const { SECRET } = process.env;
const router = express.Router();

router.use('/session', loginRouter);
router.use('/cars', jwt({ secret: SECRET }), carRouter);

export default router;
