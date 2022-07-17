import {
  addResourcePrefixToColumns,
  makeApplyWhere,
  handlesDeletedAt,
  applyLimit,
  applyInclude,
  makeApplyInclude,
  makeGetFrom,
} from '../makeQueryWhereService';
import sinon from 'sinon';

describe('Where query helper service', () => {
  describe('addResourcePrefixToColumns', () => {
    it('should return query with prefix when this hasnt been applied', () => {
      //GIVEN
      const resource = 'cars';
      const query = {
        id: '1',
        brand: 'VW',
      };

      //WHEN
      const resultQuery = addResourcePrefixToColumns(query, resource);

      //THEN
      const expectedQuery = {
        'cars.id': '1',
        'cars.brand': 'VW',
      };
      expect(resultQuery).toEqual(expectedQuery);
    });

    it('should return unaltered object when prefix has already been applied', () => {
      //GIVEN
      const resource = 'cars';
      const query = {
        'item.id': '1',
        'item.brand': 'VW',
      };

      //WHEN
      const resultQuery = addResourcePrefixToColumns(query, resource);

      //THEN
      expect(resultQuery).toEqual(query);
    });
  });

  it('applyWhere - should call queryBuilder.where with correct query', () => {
    //GIVEN
    const queryInput = {
      id: '1',
    };
    const queryOutput = {
      'cars.id': '1',
    };
    const queryBuilderObj = { where: sinon.stub() };
    const addResourcePrefixToColumns = sinon.stub().returns(queryOutput);
    const applyWhere = makeApplyWhere({ addResourcePrefixToColumns });

    //WHEN
    applyWhere(queryBuilderObj, queryInput, 'cars');

    //THEN
    sinon.assert.calledWithExactly(addResourcePrefixToColumns, queryInput, 'cars');
    sinon.assert.calledWithExactly(queryBuilderObj.where, queryOutput);
  });

  describe('handlesDeletedAt', () => {
    it.each(['deleted_at', 'searchDeletedRecords'])('should not call queryBuilder.whereNull when %s is present', (queryParam) => {
      //GIVEN
      const queryInput = {
        id: '1',
        [queryParam]: 'DELETED_AT_BOOL_OR_DATE',
      };
      const queryBuilderObj = { whereNull: sinon.stub() };

      //WHEN
      handlesDeletedAt(queryBuilderObj, queryInput, 'cars');

      //THEN
      sinon.assert.notCalled(queryBuilderObj.whereNull);
    });

    it('should call queryBuilder.whereNull with correct params when deleted_at is missing', () => {
      //GIVEN
      const queryInput = {
        id: '1',
      };
      const queryBuilderObj = { whereNull: sinon.stub() };

      //WHEN
      handlesDeletedAt(queryBuilderObj, queryInput, 'cars');

      //THEN
      sinon.assert.calledWithExactly(queryBuilderObj.whereNull, 'cars.deleted_at');
    });
  });

  it('applyLimit - should call queryBuilder.limit when limit is passed', () => {
    //GIVEN
    const queryBuilderObj = { limit: sinon.stub() };

    //WHEN
    applyLimit(queryBuilderObj, 10);

    //THEN
    sinon.assert.calledWithExactly(queryBuilderObj.limit, 10);
  });

  describe('applyInclude', () => {
    it('should call queryBuilder.join with correct params when include has one member', () => {
      //GIVEN
      const queryBuilderObj = { join: sinon.stub().returns({ options: sinon.stub() }) };
      const include = 'cars';
      const tableName = 'services';
      const FK_CONSTANTS = {
        cars: 'car_id',
      };
      const applyInclude = makeApplyInclude({ FK_CONSTANTS });

      //WHEN
      applyInclude(queryBuilderObj, { include, tableName });

      //THEN
      sinon.assert.calledWithExactly(queryBuilderObj.join, 'cars', `services.car_id`, '=', `cars.id`);
    });

    it('should call queryBuilder.join for for every member when multiple members are present', () => {
      //GIVEN
      const queryBuilderObj = { join: sinon.stub().returns({ options: sinon.stub() }) };
      const include = 'cars,brand';
      const tableName = 'services';
      const FK_CONSTANTS = {
        cars: 'car_id',
        brand: 'brand_id',
      };
      const applyInclude = makeApplyInclude({ FK_CONSTANTS });

      //WHEN
      applyInclude(queryBuilderObj, { include, tableName });

      //THEN
      sinon.assert.calledTwice(queryBuilderObj.join);
    });
  });

  describe('getFrom', () => {
    const queryBuilderFns = { from: sinon.stub(), select: sinon.stub() };
    const queryBuilder = {
      from: queryBuilderFns.from.returns(queryBuilderFns),
      select: queryBuilderFns.select.returns(queryBuilderFns),
    };
    const applyWhere = sinon.stub();
    const handlesDeletedAt = sinon.stub();
    const applyLimit = sinon.stub();
    const applyInclude = sinon.stub();

    beforeEach(() => {
      sinon.resetHistory();
    });

    it('should call queryBuilder.from with correct params', async () => {
      //GIVEN
      const tableName = 'services';
      const query = { id: 1 };
      const fields = ['id', 'name'];
      const getFrom = makeGetFrom({ queryBuilder, applyInclude, applyWhere, applyLimit, handlesDeletedAt });

      //WHEN

      await getFrom(tableName, { query, fields });

      //THEN

      sinon.assert.calledWith(queryBuilder.from, tableName);
      sinon.assert.calledWith(queryBuilder.select, 'id', 'name');
    });

    it('should call applyWhere with query and resourcesJoinIds', async () => {
      //GIVEN
      const tableName = 'services';
      const query = { id: 1 };
      const resourcesJoinIds = { customer_car_id: 2 };
      const fields = ['id', 'name'];
      const getFrom = makeGetFrom({ queryBuilder, applyInclude, applyWhere, applyLimit, handlesDeletedAt });

      //WHEN

      await getFrom(tableName, { query, fields, resourcesJoinIds });

      //THEN

      sinon.assert.calledWith(applyWhere, queryBuilderFns, { ...query, ...resourcesJoinIds });
    });

    it('should call applyLimit with limit', async () => {
      //GIVEN
      const tableName = 'services';
      const limit = 5;
      const getFrom = makeGetFrom({ queryBuilder, applyInclude, applyWhere, applyLimit, handlesDeletedAt });

      //WHEN

      await getFrom(tableName, { limit });

      //THEN

      sinon.assert.calledWith(applyLimit, queryBuilderFns, limit);
    });

    it('should call applyInclude with table to be joined', async () => {
      //GIVEN
      const tableName = 'services';
      const include = 'customer_cars';

      const getFrom = makeGetFrom({ queryBuilder, applyInclude, applyWhere, applyLimit, handlesDeletedAt });

      //WHEN

      await getFrom(tableName, { include });

      //THEN

      sinon.assert.calledWith(applyInclude, queryBuilderFns, { tableName, include });
    });
  });
});
