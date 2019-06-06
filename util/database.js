// const mysql = require('mysql2');

// const pool = mysql.createPool({
// 	host: 'localhost',
// 	user: 'root',
// 	database: 'nodeComplete',
// 	password: ''
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodeComplete', 'root', '', {
	dialect: 'mysql',
	host: 'localhost'
});

module.exports = sequelize;