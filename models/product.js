const getDB = require('../util/database.js').getDB;
const mongodb = require('mongodb');

class Product {
	constructor(title, price, description, imageUrl, id, userId) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = id ? new mongodb.ObjectId(id) : null;
		this.userId = new mongodb.ObjectId(userId);
	}

	save() {
		const db = getDB();
		let dbOp;
		if (this._id) {
			dbOp = db.collection('products')
				.updateOne({_id: this._id}, {$set: this});
		} else {
			dbOp = db.collection('products').insertOne(this);
		}
		return dbOp
		.then(result => {
			console.log(result);
		})
		.catch(err => console.log(err));
	}

	static fetchAll() {
		const db = getDB();
		return db.collection('products').find().toArray()
		.then(products => {
			return products;
		})
		.catch(err => console.log(err));
	}

	static findById(prodId) {
		const db = getDB();
		return db.collection('products').find({_id: new mongodb.ObjectId(prodId)}).next()
		.then(product => {
			return product;
		})
		.catch(err => console.log(err));
	}

	static deleteById(prodId) {
		const db = getDB();
		return db.collection('products')
		.deleteOne({_id: new mongodb.ObjectId(prodId)})
		.then(result => {
			console.log(result);
		})
		.catch(err => console.log(err));
	}
}
module.exports = Product;



// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
// 	id: {
// 		type: Sequelize.INTEGER,
// 		autoIncrement: true,
// 		allowNull: false,
// 		primaryKey: true
// 	},
// 	title: Sequelize.STRING,
// 	price: {
// 		type: Sequelize.DOUBLE,
// 		allowNull: false
// 	},
// 	imageUrl: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	},
// 	description: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	}
// });

// module.exports = Product;


// const db = require('../util/database');
// const Cart = require('./cart');


// module.exports = class Product {
// 	constructor(id, title, imageUrl, description, price) {
// 		this.id = id;
// 		this.title = title;
// 		this.imageUrl = imageUrl;
// 		this.description = description;
// 		this.price = price;
// 	}

// 	save() {
// 		return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
// 		 [this.title, this.price, this.description, this.imageUrl]);
// 	}

// 	static deleteById(id) {

// 	}

// 	//static - can call without making an instance or using the 'new' keyword
// 	static fetchAll() {
// 		return db.execute('SELECT * FROM products');
// 	}

// 	static findById(id) {
// 		return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
// 	}

// };