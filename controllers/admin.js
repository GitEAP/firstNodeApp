const Product = require('../models/product.js');

//show add form
exports.create = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false
	})
};

// save product
exports.store = (req,res,next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const price = req.body.price;

	//Mongo Example
	const product = new Product(title, price, description, imageUrl, null, req.user._id);
	product.save()
	.then(result => { console.log('Product Saved'); res.redirect('/admin/products'); })
	.catch(err => { console.log(err); });

	// MySQL example
	// const product = new Product(null, title, imageUrl, description, price);
	// product.save()
	// .then(() => {
	// 	res.redirect('/');
	// })
	// .catch(err => {
	// 	console.log(err);
	// });


	// Sequelize example
	// Product.create({
	// 	title,
	// 	price,
	// 	imageUrl,
	// 	description,
	// })
	// .then(result => { console.log('Product Saved'); res.redirect('/admin/products'); })
	// .catch(err => { console.log(err); });


	// Sequelize with relation example
	// req.user.createProduct({
	// 	title,
	// 	price,
	// 	imageUrl,
	// 	description,
	// })
	// .then(result => { console.log('Product Saved'); res.redirect('/admin/products'); })
	// .catch(err => { console.log(err); });

};

exports.edit = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const productID = req.params.id;

	Product.findById(productID)
	.then(product => {
		if (!product) {
			return res.redirect('/');
		}
		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product
		});
	})
	.catch(err => { console.log(err); });
};

exports.update = (req,res,next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const updatedPrice = req.body.price;

	const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, prodId);
	product.save()
		.then(result => {
			console.log('Product updated');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};

exports.destroy = (req,res,next) => {
	const prodId = req.body.productId;
	Product.deleteById(prodId)
		.then (result => {
			console.log('product destroyed');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req,res,next) => {
	Product.fetchAll()
	.then(products => {
		res.render('admin/products', { 
			pageTitle: 'Admin Products', 
			products,
			path: '/admin/products'
		});
	}).catch(err => {
		console.log(err);
	});
};