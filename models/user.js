const getDB = require('../util/database.js').getDB;
const mongodb = require('mongodb');

const modelCollection = 'nodeUsers';
const ObjectId = mongodb.ObjectId;

class User {
	constructor (username, email, cart, id) {
		this.name = username;
		this.email = email;
		this.cart = cart;
		this._id = id;
	}

	save() {
		const db = getDB();
		return db.collection(modelCollection).insertOne(this)
		.then(result => {
			console.log(result);
		})
		.catch(err => console.log(err));
	}

	static findById(userId) {
		const db = getDB();
		return db.collection(modelCollection)
		.findOne( {_id: new mongodb.ObjectId(userId)} )
		.then(user => {
			console.log('found user: ', user);
			return user;
		})
		.catch(err => console.log("no user found: ", err));
	}

	// Cart
	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex(cp => {
			return cp.productId.toString() === product._id.toString();
		});
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];
		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		}
		else {
			updatedCartItems.push({
				productId: new ObjectId(product._id),
				quantity: newQuantity
			});
		}
		const updatedCart = { items: updatedCartItems };
		const db = getDB();
		return db.collection(modelCollection)
			.updateOne(
				{ _id: new ObjectId(this._id) },
				{ $set: { cart: updatedCart } }
			);
	}

  getCart() {
    const db = getDB();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        });
      });
  }

	deleteCartItem(productId) {
		const updatedCartItems = this.cart.items.filter(item => {
			return item.productId.toString() !== productId.toString();
		});
		const db = getDB();
		return db.collection(modelCollection)
			.updateOne(
				{ _id: new ObjectId(this._id) },
				{ $set: { cart: {items: updatedCartItems } } }
			);
	}

	// Orders
	addOrder() {
		const db = getDB();
		return this.getCart()
		.then(products => {
			const order = {
				items: products,
				user: {
					_id: new ObjectId(this._id),
					name: this.name
				}
			};
			return db.collection('orders').insertOne(order);
		})	
		.then(result => {
			this.cart = {items: []};
			return db
				.collection(modelCollection)
				.updateOne(
					{ _id: new ObjectId(this._id) },
					{ $set: { cart: { items: updatedCartItems } } }
				)
		});
	}

	getOrders() {
		const db = getDB();
		return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
	}
}

module.exports = User;