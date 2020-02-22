import MySqlService from "./mysqlService";

export default ({ mysqlService } = { mysqlService: MySqlService() }) => {
  const getList = async ({ fields, limit } = {}) => {
    const columns = fields ? fields.split(",") : "*"
    const carList = await mysqlService.query(`SELECT ?? from cars`, [columns])
    return carList;
  }

  return {
    getList
  }
}