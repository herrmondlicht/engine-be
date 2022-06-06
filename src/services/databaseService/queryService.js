import makeDBOperationsService from './dbOperations/dbOperationsService';
import queryBuilder from './dbOperations/queryBuilder';
import FK_CONSTANTS from './constants_FK';
import { makeApplyInclude, applyLimit, makeGetFrom, addResourcePrefixToColumns, handlesDeletedAt, makeApplyWhere } from './dbOperations/makeQueryWhereService';

// set dependencies
const applyInclude = makeApplyInclude({ FK_CONSTANTS });
const applyWhere = makeApplyWhere({ addResourcePrefixToColumns });
const getFrom = makeGetFrom({ applyInclude, applyLimit, applyWhere, handlesDeletedAt, queryBuilder });

export const queryService = makeDBOperationsService({ queryBuilder, getFrom });
