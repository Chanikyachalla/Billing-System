const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingcontroller');

router.get('/', billingController.renderBillingPage);
router.post('/', billingController.handleBilling);
router.get('/history', billingController.renderBillingHistory);
router.post("/billing", async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount) return res.status(400).send("Total amount required");

    const bill = new Bill({ totalAmount, date: new Date() });
    await bill.save();

    res.send("Bill saved successfully");
  } catch (error) {
    console.error("Error saving bill:", error);
    res.status(500).send("Server error");
  }
});


module.exports = router;
