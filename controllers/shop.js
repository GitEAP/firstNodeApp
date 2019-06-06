const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.findAll()
		.then(products => {
			res.render('shop/product-list', { 
				pageTitle: 'All Products', 
				products: products,
				path: '/products'
			});
		}).catch(err => {
			console.log(err);
	});
};

exports.show = (req, res, next) => {
	const productID = req.params.id;
	// Product.findAll({
	// 	where: {id: productId}
	// }).then(products => {
		
	// });
	Product.findByPk(productID)
	.then((product) => {
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: '/products'
		});
	})
	.catch(err => {
		console.log(err);
	});
	
};

exports.getIndex = (req, res, next) => {
	Product.findAll()
		.then(products => {
			res.render('shop/index', { 
				pageTitle: 'Shop', 
				products: products,
				path: '/'
			});
		}).catch(err => {
			console.log(err);
	});
	// Product.fetchAll()
	// .then(([rows, fieldData]) => {
	// 	res.render('shop/index', { 
	// 		pageTitle: 'Shop', 
	// 		products: rows,
	// 		path: '/'
	// 	});
	// })
	// .catch(err => {
	// 	console.log(err);
	// });
};

exports.getCart = (req, res, next) => {
	req.user.getCart()
	.then(cart => {
		return cart.getProducts()
		.then(products => {
			res.render('shop/cart', { 
				pageTitle: 'Your Cart', 
				products: products,
				path: '/cart'
			});
		}).catch(err => console.log(err));
	}).catch(err => console.log(err));
};

exports.storeCart = (req, res, next) => {
	const productID = req.body.productId;
	let fetchedCart;
	let newQuantity = 1;
	req.user.getCart()
	.then(cart => {
		fetchedCart = cart;
		return cart.getProducts( {where: {id: productID}} );
	})
	.then(products => {
		let product;
		if (products.length > 0) {
			product = products[0];
		}
		//increase quantity
		if (product) {
			const oldQuantity = product.cartItem.quantity;
			newQuantity = oldQuantity + 1;
			return product
		}
		return Product.findByPk(productID)
	})
	.then(product => {
		return fetchedCart.addProduct(product, {
			through: {quantity: newQuantity}
		});
	})
	.then(() => {
		res.redirect('/cart');
	})
	.catch(err => console.log(err));
};

exports.CartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user.getCart()
	.then(cart => {
		return cart.getProducts({where: {id: prodId}});
	})
	.then(products => {
		const product = products[0];
		return product.cartItem.destroy();
	})
	.then(result => {
		res.redirect('/cart');
	})
	.catch(err => console.log(err));

};

exports.getOrders = (req, res, next) => {
	req.user.getOrders({include: ['products']})
	.then(orders => {
		res.render('shop/orders', { 
			pageTitle: 'Your Orders', 
			products,
			path: '/orders'
		});
	})
	.catch(err => console.log(err));
};

exports.storeOrder = (req, res, next) => {
	let fetchedCart;
	req.user.getCart()
	.then(cart => {
		return cart.getProducts();
	})
	.then(products => {
		return req.user.createOrder()
		.then(order => {
			return order.addProducts(products.map(product => {
				product.orderItem = { quantity: product.cartItem.quantity };
				return product;
			}))
		})
		.catch(err => console.log(err));
	})
	.then(result => {
		return fetchedCart.setProducts(null);
	})
	.then(result => {
		res.redirect('/orders');
	})
	.catch(err => console.log(err));
};

