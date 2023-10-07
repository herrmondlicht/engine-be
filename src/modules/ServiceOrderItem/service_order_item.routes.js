import express from 'express';
import makeCRUDService from '../../services/makeCRUDService';
import makeCRUDController from '../Common/common.controller';
import { queryService } from '../../services/databaseService/queryService';
import queryBuilder from '../../services/databaseService/dbOperations/queryBuilder';
import makeServiceOrderItemsService from '../../services/serviceOrderItemsService';

const router = express.Router();

const CRUDService = makeCRUDService({ queryService, resourceName: 'service_order_items' });
const serviceItemsCRUDService = makeServiceOrderItemsService({ commonService: CRUDService, queryBuilder, queryService });
const CRUDControllerMethods = makeCRUDController({ resourceService: serviceItemsCRUDService });

router.get('/', CRUDControllerMethods.list);
router.post('/', CRUDControllerMethods.create);
router.patch('/:id', CRUDControllerMethods.update);
router.get('/:id', CRUDControllerMethods.byId);
router.delete('/:id', CRUDControllerMethods.delete);

export default router;
