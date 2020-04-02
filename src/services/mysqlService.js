import mysql from 'mysql';

require('dotenv').config();

const { DB_PASSWORD, DB_HOST } = process.env;

const _dbconfig = {
  host: DB_HOST,
  password: DB_PASSWORD,
  database: 'engine',
  user: 'root',
  port: 3307,
};


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
  return (query, options) => new Promise((resolve, reject) => {
    try {
      connection.query(query, options, (err, results, fields) => {
        if (err) return reject(err);
        return resolve(results);
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function query(query, options) {
  try {
    const connection = connectToDB();
    const result = await querySQLWithConnection(connection)(query, options);
    connection.end();
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function connectToDB(dbconfig = _dbconfig) {
  const connection = mysql.createConnection({
    ...dbconfig,
    multipleStatements: true,
  });
  connection.connect();
  return connection;
}

export default () => ({
  query,
  connectionWithTransaction,
  querySQLWithConnection,
  connectToDB,
});
