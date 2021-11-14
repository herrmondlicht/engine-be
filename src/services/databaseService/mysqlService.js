import _mysql from 'mysql';

import dbCredentials from '../../constants/sqlCredentials';

const connectToDB = ({ dbURL = dbCredentials.DATABASE_URL, mysql = _mysql } = {}) => {
  const connection = mysql.createConnection(dbURL);
  connection.connect();

  connection.on('connection', () => {
    console.log('database connected');
  });

  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
      console.error('lost connection, trying again in 5 seconds');
      setTimeout(() => {
        connectToDB(dbURL, mysql);
      }, 5000);
    } else {
      throw err;
    }
  });

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
