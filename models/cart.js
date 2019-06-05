const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
	static addProduct(id, productPrice) {
		// fetch previous cart
		fs.readFile(p, (err, fileContent) => {
			let cart = {products: [], totalPrice: 0 };//new empty cart
			if (!err) {
				cart = JSON.parse(fileContent);// fill cart if exists
			}
		// check if product exists in the cart
			const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
			const existingProduct = cart.products[existingProductIndex];
		// add new product if not in cart or increase qty if found
			let updatedProduct;
			if (existingProduct) {
				updatedProduct = {...existingProduct };
				updatedProduct.qty = updatedProduct.qty + 1;
				cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = { id: id, qty: 1 };
				cart.products = [...cart.products, updatedProduct];
			}
			cart.totalPrice = cart.totalPrice + +productPrice;
			fs.writeFile(p, JSON.stringify(cart), err => {
				console.log(err);
			});
		});
	}

	static deleteProduct(id, productPrice) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				return;
			}
			const updatedCart = {...JSON.parse(fileContent)};
			const product = updatedCart.products.find(prod => prod.id === id);
			if (!product) {
				return;
			}
			const productQty = product.qty;
			updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
			updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
			fs.writeFile(p, JSON.stringify(updatedCart), err => {
				console.log(err);
			});
		});
	}

	static getCart(callback) {
		fs.readFile(p, (err, fileContent) => {
			const cart = JSON.parse(fileContent);
			if (err) {
				callback(null);
			} else {
				callback(cart);
			}
		});
	}

}