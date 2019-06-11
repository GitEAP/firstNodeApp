const Product = require('../models/product');
const Order = require('../models/order.js');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/product-list', { 
				pageTitle: 'All Products', 
				products: products,
				path: '/products'
			});
		})
		.catch(err => {
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
	Product.find()
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
	req.user.populate('cart.items.productId')
	.execPopulate()
	.then(user => {
		const products = user.cart.items;
		res.render('shop/cart', { 
			path: '/cart',
			pageTitle: 'Your Cart', 
			products: products
		});
	})
	.catch(err => console.log(err));
};

exports.storeCart = (req, res, next) => {
	const productId = req.body.productId;
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
	Order.find({'user.userId': req.user._id})
	.then(orders => {
		res.render('shop/order', { 
			pageTitle: 'Your Orders', 
			path: '/orders',
			orders: orders
		});
	})
	.catch(err => console.log(err));
};

exports.storeOrder = (req, res, next) => {
	req.user.populate('cart.items.productId')
	.execPopulate()
	.then(user => {
		const products = user.cart.items.map(i => {
			return { quantity: i.quantity, product: { ...i.productId._doc } };
		});
		const order = new Order({
			user: {
				email: req.user.email,
				userId: req.user
			},
			products: products 
		});
		return order.save();
	})
	.then(result => {
		return req.user.clearCart();
	})
	.then(() => {
		res.redirect('/orders');
	})
	.catch(err => console.log(err));	
};

