const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
	'mongodb+srv://erickp:mongoSFA@testdb-i08z9.mongodb.net/test?retryWrites=true&w=majority',
	{ useNewUrlParser: true }
  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      throw err;
    });
};



const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;




// const mysql = require('mysql2');

// const pool = mysql.createPool({
// 	host: 'localhost',
// 	user: 'root',
// 	database: 'nodeComplete',
// 	password: ''
// });

// module.exports = pool.promise();



// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('nodeComplete', 'root', '', {
// 	dialect: 'mysql',
// 	host: 'localhost'
// });

// module.exports = sequelize;