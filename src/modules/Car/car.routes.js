import express from 'express';
import makeMysqlService from '../../services/databaseService/mysqlService';
import makeCRUDService from '../../services/makeCRUDService';
import makeCRUDController, { respondError } from '../Common/common.controller';
import { queryService } from '../../services/databaseService/queryService';
import makeCarController from './car.controller';
import makeCarService from '../../services/carService';

const router = express.Router();

const CRUDServiceMethods = makeCRUDService({ queryService, resourceName: 'cars' });
const carService = makeCarService({
  queryService,
  mysqlService: makeMysqlService(),
  CRUDServiceMethods,
});
const CRUDControllerMethods = makeCRUDController({ resourceService: carService });

const carController = makeCarController({
  carService,
  CRUDControllerMethods,
  respondError,
});

router.get('/', carController.list);
router.post('/', carController.create);
router.get('/:id', carController.byId);

export default router;
