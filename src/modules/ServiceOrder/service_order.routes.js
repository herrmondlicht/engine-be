import express from 'express';

import bindResourcesToRoute from '../../middlewares/bindResourcesToRoute';
import _serviceOrderController from './service_order.controller';
import serviceOrderService from '../../services/serviceOrderService';
import serviceOrderItemRouter from '../ServiceOrderItem/service_order_item.routes';

const router = express.Router();

const serviceOrderController = _serviceOrderController({ serviceOrderService: serviceOrderService() });

router.get('/', serviceOrderController.list);
router.post('/', serviceOrderController.create);
router.patch('/:id', serviceOrderController.update);
router.get('/:id', serviceOrderController.byId);
router.delete('/:id', serviceOrderController.delete);

router.use('/:id/items', bindResourcesToRoute('service_order_id', { cleanPreviousResources: true }), serviceOrderItemRouter);

export default router;
