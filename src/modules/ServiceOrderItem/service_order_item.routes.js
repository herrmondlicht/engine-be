import express from 'express';
import makeCRUDService from '../../services/makeCRUDService';
import makeCRUDController from '../Common/common.controller';
import { queryService } from '../../services/databaseService/queryService';

const router = express.Router();

const CRUDService = makeCRUDService({ queryService, resourceName: 'service_order_items' });
const CRUDControllerMethods = makeCRUDController({ resourceService: CRUDService });

router.get('/', CRUDControllerMethods.list);
router.post('/', CRUDControllerMethods.create);
router.patch('/:id', CRUDControllerMethods.update);
router.get('/:id', CRUDControllerMethods.byId);
router.delete('/:id', CRUDControllerMethods.delete);

export default router;
