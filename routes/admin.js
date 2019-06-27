// const path = require('path');
// const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.js');
const { body } = require('express-validator/check');

const isAuth = require('../middleware/is-auth.js');

//routes
router.get('/add-product', isAuth, adminController.create);

router.post('/add-product', [	
	body('title')
		.trim()
		.isString()
		.isLength({min: 3}),

	body('price')
		.isFloat(),
	body('description')
		.trim()
		.isLength({min: 5, max: 400})
	],
	isAuth,
	adminController.store);

router.get('/edit-product/:id', isAuth, adminController.edit);

router.post('/edit-product', [	
	body('title')
		.trim()
		.isString()
		.isLength({min: 3}),
	body('price')
		.isFloat(),
	body('description')
		.trim()
		.isLength({min: 5, max: 400})
	],
	isAuth, adminController.update);

router.post('/delete-product', isAuth, adminController.destroy);

router.get('/products', isAuth, adminController.getProducts);

module.exports = router;
