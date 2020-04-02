import express from 'express';
import SessionController from './session.controller';

const router = express.Router();

const sessionController = SessionController();
router.post('/login', sessionController.login);

export default router;
