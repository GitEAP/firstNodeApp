const Product = require('../models/product.js');

//show add form
exports.create = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		isAuthenticated: req.session.isLoggedIn
	})
};

// save product
exports.store = (req,res,next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const price = req.body.price;

	// Mongoose Example
	const product = new Product({
		title,
		price,
		description,
		imageUrl,
		userId: req.user
	});
	product.save()
	.then(result => { console.log('Product Saved'); res.redirect('/admin/products'); })
	.catch(err => { console.log(err); });
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
			product,
			isAuthenticated: req.session.isLoggedIn
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

	Product.findById(prodId)
	.then(product => {
		product.title = updatedTitle;
		product.price = updatedPrice;
		product.description = updatedDescription;
		product.imageUrl = updatedImageUrl;
		return product.save()
	})
	.then(result => {
		console.log('Product updated');
		res.redirect('/admin/products');
	})
	.catch(err => console.log(err));
};

exports.destroy = (req,res,next) => {
	const prodId = req.body.productId;
	Product.findByIdAndRemove(prodId)
		.then (result => {
			console.log('product destroyed');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req,res,next) => {
	Product.find()
	// .select('title price -_id')
	// .populate('userId', 'name email')
	.then(products => {
		res.render('admin/products', { 
			pageTitle: 'Admin Products', 
			products,
			path: '/admin/products',
			isAuthenticated: req.session.isLoggedIn
		});
	}).catch(err => {
		console.log(err);
	});
};