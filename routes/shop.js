// const path = require('path');
// const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.js');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.show)
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.storeCart);
router.post('/cart-delete-item', shopController.CartDeleteProduct);
router.get('/checkout', shopController.getCheckout);
router.get('/orders', shopController.getOrders);

module.exports = router;