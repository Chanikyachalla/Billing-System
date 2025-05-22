const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET /api/products?query=wire
router.get('/products', async (req, res) => {
  const query = req.query.query || '';
  const results = await Product.find({ name: { $regex: query, $options: 'i' } }).limit(5);
  res.json(results);
});


router.post('/price-details', async (req, res) => {
  const items = req.body.items;
  const detailedItems = [];
  let total = 0;

  for (const item of items) {
    const product = await Product.findOne({ name: item.name });
    if (!product) continue;

    const price = product.price * item.quantity;
    total += price;
    detailedItems.push({
      name: item.name,
      quantity: item.quantity,
      price: product.price
    });
  }

  res.json({ detailedItems, total });
});
module.exports = router;
