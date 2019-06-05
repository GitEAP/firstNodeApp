// const path = require('path');
// const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.js');

//routes
router.get('/add-product', adminController.create);
router.post('/add-product', adminController.store);
router.get('/edit-product/:id', adminController.edit);
router.post('/edit-product', adminController.update);
router.post('/delete-product', adminController.destroy);
router.get('/products', adminController.getProducts);

module.exports = router;
