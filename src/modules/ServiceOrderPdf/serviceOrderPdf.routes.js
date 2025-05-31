import express from 'express';
import serviceOrderPDFController from './serviceOrderPdf.composition';

const router = express.Router();

router.get('/:id', serviceOrderPDFController.byId);

export default router;
