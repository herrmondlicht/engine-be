import mysql from 'mysql';
import MySqlService from './mysqlService';

const makeWhereQuery = (query) => {
  try {
    const JSONQuery = typeof query === 'string' ? JSON.parse(query) : query;
    return Object.entries(JSONQuery).reduce((prev, [key, value], index) => {
      if (index === 0) {
        return mysql.format('WHERE ?? = ?', [key, value]);
      }

      return `${prev} ${mysql.format('AND ?? = ?', [key, value])}`;
    }, '');
  } catch (e) {
    const parseQueryError = new Error('Could not parse query, please verify the query sent to the endpoint');
    parseQueryError.isOperational = true;
    throw parseQueryError;
  }
};

const getFrom = (mysqlService) => async (table, { fields, query } = {}) => {
  try {
    const columns = fields ? fields.split(',') : '*';
    const whereClause = query ? makeWhereQuery(query) : '';
    const retrievedData = await mysqlService.query(`SELECT ?? from ?? ${whereClause}`, [columns, table]);
    return retrievedData;
  } catch (e) {
    if (e.code === 'ER_BAD_FIELD_ERROR') {
      const badFieldError = new Error('field declared in query was not found');
      badFieldError.isOperational = true;
      throw badFieldError;
    } else {
      throw e;
    }
  }
};

export default ({ mysqlService = MySqlService() } = {}) => ({
  getFrom: getFrom(mysqlService),
});
