const { validationResult } = require('express-validator/check');
const fileHelper = require('../util/file.js');

const Product = require('../models/product.js');

//show add form
exports.create = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: []
	})
};

// save product
exports.store = (req,res,next) => {
	const title = req.body.title;
	const image = req.file;
	const description = req.body.description;
	const price = req.body.price;
	if (!image) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title, price, description
			},
			errorMessage: 'File is not an image',
			validationErrors: []
		}); 
	}
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title, price, description
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}

	const imageUrl = image.path;

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
	.catch(err => { 
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });
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
			hasError: false,
			errorMessage: null,
			validationErrors: []
		});
	})
	.catch(err => { 
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });
};

exports.update = (req,res,next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const image = req.file;
	const updatedDescription = req.body.description;
	const updatedPrice = req.body.price;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: true,
			hasError: true,
			product: {
				title: updatedTitle,
				price: updatedPrice, 
				description: updatedDescription,
				_id: prodId
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}

	Product.findById(prodId)
	.then(product => {
		if(product.userId.toString() !== req.user._id.toString()) {
			return res.redirect('/');
		}
		product.title = updatedTitle;
		product.price = updatedPrice;
		product.description = updatedDescription;
		if (image) {
			fileHelper.deleteFile(product.imageUrl);
			product.imageUrl = image.path;
		}
		return product.save()
			.then(result => {
				console.log('Product updated');
				res.redirect('/admin/products');
			})
	})
	.catch(err => { 
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });
};

exports.destroy = (req,res,next) => {
	// const prodId = req.body.productId;
	const prodId = req.params.productId;

	Product.findById(prodId)
		.then(product => {
			if (!product) {
				return next(new Error('Product not found'));
			}
			fileHelper.deleteFile(product.imageUrl);
			return Product.deleteOne({_id: prodId, userId: req.user._id});
		})
		.then (result => {
			console.log('product destroyed');
			// res.redirect('/admin/products');
			res.status(200).json({message: 'Success!'});
		})
		.catch(err => { 
			// const error = new Error(err);
			// error.httpStatusCode = 500;
			// return next(error);
			res.status(500).json({message: 'Deleting product failed'});
		 });
};


exports.getProducts = (req,res,next) => {
	Product.find({userId: req.user._id})
	// .select('title price -_id')
	// .populate('userId', 'name email')
	.then(products => {
		res.render('admin/products', { 
			pageTitle: 'Admin Products', 
			products,
			path: '/admin/products'
		});
	})
	.catch(err => { 
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	 });
};