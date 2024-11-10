const express = require('express');
const { addToCart, updateCartItem, removeFromCart, getCartItems, getCartItemById } = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, addToCart);
router.put('/:id', auth, updateCartItem);
router.delete('/:id', auth, removeFromCart);
router.get('/', auth, getCartItems);
router.get('/:productId', auth, getCartItemById);

module.exports = router;
