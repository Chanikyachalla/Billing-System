const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/products', async (req, res) => {
  const query = req.query.query || '';
  const results = await Product.find({ name: { $regex: query, $options: 'i' } }).limit(5);
  res.json(results);
});

router.post('/price-details', async (req, res) => {
  const { items, overallDiscount = 0 } = req.body;
  const names = items.map(i => i.name);
  const products = await Product.find({ name: { $in: names } });

  let total = 0;
  const detailedItems = items.map(item => {
    const product = products.find(p => p.name === item.name);
    const baseRate = product ? product.price : 0;
    const discount = parseFloat(item.discount || 0);
    const hike = parseFloat(item.hike || 0);

    const effectiveRate = baseRate * (1 + (hike - discount) / 100); // Corrected formula
    const amount = effectiveRate * item.quantity;

    total += amount;

    return {
      name: item.name,
      quantity: item.quantity,
      price: baseRate,
      discount,
      hike,
      effectiveRate: parseFloat(effectiveRate.toFixed(2)),
      amount: parseFloat(amount.toFixed(2)),
    };
  });

  res.json({
    detailedItems,
    total: parseFloat(total.toFixed(2)),
    overallDiscount,
    finalTotal: parseFloat((total - (overallDiscount / 100) * total).toFixed(2))
  });
});
router.get("/api/revenue-history", async (req, res) => {
  try {
    const result = await Bill.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalRevenue: { $sum: "$totalAmount" },
          billCount: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
