const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add a product to the cart
exports.addToCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      console.log('Adding product to cart:', { productId, quantity });
  
      const product = await Product.findById(productId);
    //   if (!product) return res.status(404).json({ message: 'Product not found' });
  
      let cart = await Cart.findOne({ userId: req.user.id });
      if (cart) {
        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        console.log('Item index:', itemIndex);
  
        if (itemIndex > -1) {
          cart.products[itemIndex].quantity += quantity;
        } else {
          cart.products.push({ productId, quantity });
        }
      } else {
        cart = await Cart.create({ userId: req.user.id, products: [{ productId, quantity }] });
      }
  
      await cart.save();
      res.json(cart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    const item = cart.products.find(p => p.productId.toString() === req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    const itemIndex = cart.products.findIndex(p => p.productId.toString() === req.params.id);
    if (itemIndex > -1) {
      cart.products.splice(itemIndex, 1);
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Product not in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all products in the cart for the logged-in user
exports.getCartItems = async (req, res) => {
    try {
      // Find the cart for the current user
      const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
      
      // If no cart exists, return an empty array
      if (!cart) {
        return res.json({ message: 'Cart is empty', products: [] });
      }
      
      // Return the products in the cart
      res.json(cart.products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  // Fetch a single product in the cart by its product ID
exports.getCartItemById = async (req, res) => {
    try {
      const { productId } = req.params;
  
      // Find the user's cart
      const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
      
      // If no cart or no product in cart, return a 404
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      // Find the specific product in the cart
      const product = cart.products.find(p => p.productId._id.toString() === productId);
      
      if (!product) return res.status(404).json({ message: 'Product not found in cart' });
      
      // Return the product in the cart
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
