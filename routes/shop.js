const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.js');

const isAuth = require('../middleware/is-auth.js');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:id', shopController.show);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.storeCart);

router.post('/cart-delete-item', isAuth, shopController.CartDeleteProduct);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.storeOrder);

module.exports = router;