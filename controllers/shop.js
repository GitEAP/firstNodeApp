const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { validationResult } = require('express-validator/check');

const stripe = require('stripe')('api_key_secret');

const Product = require('../models/product');
const Order = require('../models/order.js');

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
	const page = +req.query.page || 1;
	let totalItems;

	Product.find()
		.countDocuments()
		.then(numProducts => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)
	})
		.then(products => {
			res.render('shop/product-list', { 
				pageTitle: 'All Products', 
				products: products,
				path: '/products',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPrevPage: page > 1,
				nextPage: page + 1,
				prevPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
			});
		})
		.catch(err => { 
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });
};

exports.getIndex = (req, res, next) => {
	const page = +req.query.page || 1;
	let totalItems;

	Product.find()
		.countDocuments()
		.then(numProducts => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)
	})
		.then(products => {
			res.render('shop/index', { 
				pageTitle: 'Shop', 
				products: products,
				path: '/',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPrevPage: page > 1,
				nextPage: page + 1,
				prevPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
			});
		})
		.catch(err => { 
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
	.catch(err => { 
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });
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
	.catch(err => { 
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });
};

exports.CartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user.deleteCartItem(prodId)
	.then(result => {
		res.redirect('/cart');
	})
	.catch(err => { 
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });
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
	.catch(err => { 
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });
};

exports.storeOrder = (req, res, next) => {
	// Stripe
	const token = req.body.stripeToken;
	let totalSum = 0;

	req.user.populate('cart.items.productId')
	.execPopulate()
	.then(user => {
		//Stipe
		user.cart.items.forEach(p => {
			totalSum += p.quantity * p.productId.price;
		});
	
		// app
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
		//stripe
		const charge = stripe.charges.create({
			amount: totalSum * 100,
			currency: 'usd',
			description: 'Demo Order',
			source: token,
			metadata: {order_id: result._id.toString()}
		});
		//app
		return req.user.clearCart();
	})
	.then(() => {
		res.redirect('/orders');
	})
	.catch(err => { 
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });	
};

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.then(order => {
			if (!order) {
				return next(new Error('No order found.'));
			}
			if (order.user.userId === req.user._id.toString()) {
				return next(new Error('Unauthorized'));
			}
		})
		.catch(err => next(err));
	const invoiceName = 'invoice-' + orderId + '.pdf';
	const invoicePath = path.join('data', 'invoices', invoiceName);

	// Generate PDF doc
	const pdfDoc = new PDFDocument();
	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

	pdfDoc.pipe(fs.createWriteStream(invoicePath));
	pdfDoc.pipe(res);

	pdfDoc.fontSize(26).text('Invoice', {
		underline: true
	});
	pdfDoc.text('------------------------------');
	let totalPrice = 0;
	order.products.forEach(prod => {
		totalPrice += prod.quantity * prod.product.price;
		pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price);
	});
	pdfDoc.text('------------------------------');
	pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

	pdfDoc.end();

	// Download File (preload file)
	// fs.readFile(invoicePath, (err, data) => {
	// 	if (err) {
	// 		return next(err);
	// 	} 
	// 	res.setHeader('Content-Type', 'application/pdf');
	// 	res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
	// 	res.send(data);
	// });

	// Stream File
	// const file = fs.createReadStream(invoicePath);
	// res.setHeader('Content-Type', 'application/pdf');
	// res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
	// res.pipe(res);
};

exports.getCheckout = (req, res, next) => {
	req.user.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const products = user.cart.items;
			let total = 0;
			products.forEach(p => {
				total += p.quantity * p.productId.price;
			});
			res.render('shop/checkout', { 
				path: '/checkout',
				pageTitle: 'Checkout', 
				products: products,
				totalSum: total
			});
		})
		.catch(err => { 
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		 });
}
