const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
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
	
	Product.findById(productID)
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
	Product.fetchAll()
		.then(products => {
			res.render('shop/index', { 
				pageTitle: 'Shop', 
				products: products,
				path: '/'
			});
		}).catch(err => {
			console.log(err);
	});
};

exports.getCart = (req, res, next) => {
	req.user.getCart()
	.then(products => {
		res.render('shop/cart', { 
			pageTitle: 'Your Cart', 
			products: products,
			path: '/cart'
		});
	})
	.catch(err => console.log(err));
};

exports.storeCart = (req, res, next) => {
	const productID = req.body.productId;
	Product.findById(productId)
	.then(product => {
		return req.user.addToCart(product);
	})
	.then(result => {
		res.redirect('/cart');
	})
	.catch(err => console.log(err));
};

exports.CartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user.deleteCartItem(prodId)
	.then(result => {
		res.redirect('/cart');
	})
	.catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
	req.user.getOrders()
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
	req.user.addOrder()
	.then(result => {
		res.redirect('/orders');
	})
	.catch(err => console.log(err));
};

