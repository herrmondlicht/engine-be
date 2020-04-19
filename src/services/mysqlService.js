import _mysql from 'mysql';
import dbCredentials from '../constants/sqlCredentials';

const connectToDB = ({ dbconfig = dbCredentials.DATABASE_CONFIG, mysql = _mysql } = {}) => {
  const connection = mysql.createConnection({
    ...dbconfig,
    multipleStatements: true,
  });
  connection.connect();
  return connection;
};

const connectionWithTransaction = () => {
  const connection = connectToDB();
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      try {
        if (err) {
          return reject(err);
        }
        return resolve(connection);
      } catch (e) {
        return reject(e);
      }
    });
  });
};

const querySQLWithConnection = (connection) => {
  return (queryString, options) =>
    new Promise((resolve, reject) => {
      try {
        connection.query(queryString, options, (err, results) => {
          if (err) return reject(err);
          return resolve(results);
        });
      } catch (e) {
        reject(e);
      }
    });
};

const query = async (queryString, options) => {
  const connection = connectToDB();
  const result = await querySQLWithConnection(connection)(queryString, options);
  connection.end();
  return result;
};

export default () => ({
  query,
  connectionWithTransaction,
  querySQLWithConnection,
  connectToDB,
});
