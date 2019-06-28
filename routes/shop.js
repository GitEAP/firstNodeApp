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

// router.post('/create-order', isAuth, shopController.storeOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/checkout', isAuth, shopController.getCheckout);

module.exports = router;