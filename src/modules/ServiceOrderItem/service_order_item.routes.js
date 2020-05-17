import express from 'express';
import _serviceOrderItemController from './service_order_item.controller';
import serviceOrderItemService from '../../services/serviceOrderItemService';

const router = express.Router();

const serviceOrderItemController = _serviceOrderItemController({ serviceOrderItemService: serviceOrderItemService() });

router.get('/', serviceOrderItemController.list);
router.post('/', serviceOrderItemController.create);
router.patch('/:id', serviceOrderItemController.update);
router.get('/:id', serviceOrderItemController.byId);
router.delete('/:id', serviceOrderItemController.delete);

export default router;
