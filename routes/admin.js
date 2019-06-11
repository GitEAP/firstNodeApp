// const path = require('path');
// const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.js');

const isAuth = require('../middleware/is-auth.js');

//routes
router.get('/add-product', isAuth, adminController.create);
router.post('/add-product', isAuth, adminController.store);
router.get('/edit-product/:id', isAuth, adminController.edit);
router.post('/edit-product', isAuth, adminController.update);
router.post('/delete-product', isAuth, adminController.destroy);
router.get('/products', isAuth, adminController.getProducts);

module.exports = router;
