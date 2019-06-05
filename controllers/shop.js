const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
	//adminRoutes.products
	// res.sendFile(path.join(rootDir, 'views', 'shop.html'));
	Product.fetchAll(products => {
		res.render('shop/product-list', { 
			pageTitle: 'All Products', 
			products,
			path: '/products'
		});
	});
};

exports.show = (req, res, next) => {
	const productID = req.params.id;
	Product.findById(productID, product => {
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: '/products'
		});
	});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/index', { 
			pageTitle: 'Shop', 
			products,
			path: '/'
		});
	});
};

exports.getCart = (req, res, next) => {
	Cart.getCart(cart => {
		Product.fetchAll(products => {
			const cartProducts = [];
			for (product of products) {
				const cartProductData = cart.products.find(prod => prod.id === product.id);
				if(cartProductData) {
					cartProducts.push({productData: product, qty: cartProductData.qty });
				}
			}
			res.render('shop/cart', { 
				pageTitle: 'Your Cart', 
				products: cartProducts,
				path: '/cart'
			});
		});
	});

};

exports.CartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, product => {
		Cart.deleteProduct(prodId, product.price);
		res.redirect('/cart');
	});
};

exports.storeCart = (req, res, next) => {
	const productID = req.body.productId;
	Product.findById(productID, (product) => {
		Cart.addProduct(productID, product.price);
	});
	res.redirect('/cart');
};

exports.getCheckout = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/checkout', { 
			pageTitle: 'Checkout', 
			products,
			path: '/checkout'
		});
	});
};

exports.getOrders = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/orders', { 
			pageTitle: 'Your Orders', 
			products,
			path: '/orders'
		});
	});
};

