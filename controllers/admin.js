const Product = require('../models/product.js');

//show add form
exports.create = (req, res, next) => {
	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
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

	const product = new Product(null, title, imageUrl, description, price);
	product.save();
	res.redirect('/');
};

exports.edit = (req, res, next) => {
	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const productID = req.params.id;
	Product.findById(productID, product => {
		if (!product) {
			return res.redirect('/');
		}
		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product
		});
	});
};

exports.update = (req,res,next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const updatedPrice = req.body.price;
	const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
	updatedProduct.save();
	res.redirect('/admin/products');
};

exports.destroy = (req,res,next) => {
	const prodId = req.body.productId;
	Product.deleteById(prodId);
	res.redirect('/admin/products');
}

exports.getProducts = (req,res,next) => {
	Product.fetchAll(products => {
		res.render('admin/products', { 
			pageTitle: 'Admin Products', 
			products,
			path: '/admin/products'
		});
	});
};