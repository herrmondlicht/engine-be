import mysql from 'mysql';
import dbCredentials from '../constants/sqlCredentials';

function connectToDB(dbconfig = dbCredentials.DATABASE_CONFIG) {
  const connection = mysql.createConnection({
    ...dbconfig,
    multipleStatements: true,
  });
  connection.connect();
  return connection;
}

function connectionWithTransaction() {
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
}

function querySQLWithConnection(connection) {
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
}

async function query(queryString, options) {
  const connection = connectToDB();
  const result = await querySQLWithConnection(connection)(queryString, options);
  connection.end();
  return result;
}

export default () => ({
  query,
  connectionWithTransaction,
  querySQLWithConnection,
  connectToDB,
});
