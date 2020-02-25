

import mysql from "mysql";
import MySqlService from "./mysqlService";

const getFrom = (mysqlService) =>
  async (table, { fields, limit, query } = {}) => {
    try {
      const columns = fields ? fields.split(",") : "*";
      const whereClause = query ? makeWhereQuery(query) : ""
      const retrievedData = await mysqlService.query(`SELECT ?? from ?? ${whereClause}`, [columns, table])
      return retrievedData;
    }
    catch (e) {
      if (e.code === "ER_BAD_FIELD_ERROR") {
        throw {
          message: "field declared in query was not found"
        }
      }
    }

  }

const makeWhereQuery = (query) => {
  try {
    const JSONQuery = typeof query === "string" ? JSON.parse(query) : query
    return Object.entries(JSONQuery).reduce((prev, [key, value], index) => {
      if (index === 0) {
        return mysql.format("WHERE ?? = ?", [key, value]);
      }

      return `${prev} ${mysql.format("AND ?? = ?", [key, value])}`

    }, "")
  }
  catch (e) {
    console.error(e, "Could not parse query coming from other service")
    throw {
      message: "Could not parse query, please verify the query sent to the endpoint"
    };
  }

}

export default ({ mysqlService = MySqlService() } = {}) => {
  return {
    getFrom: getFrom(mysqlService)
  }
}