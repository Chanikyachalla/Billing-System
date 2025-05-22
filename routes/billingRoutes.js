const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingcontroller');

router.get('/', billingController.renderBillingPage);
router.post('/', billingController.handleBilling);
router.post('/confirm', billingController.confirmBill);

router.post('/billing/confirm', async (req, res) => {
  const items = JSON.parse(req.body.items);
  const discount = parseFloat(req.body.discount);

  for (const item of items) {
    const product = await Product.findOne({ name: item.name });
    if (product) {
      product.quantity -= item.quantity;
      await product.save();
    }
  }

  // You can also save this bill to a 'bills' collection here if needed

  res.send('✅ Bill confirmed and stock updated!');
});



module.exports = router;

