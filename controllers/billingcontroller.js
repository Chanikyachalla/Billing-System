const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

const BILL_FILE = path.join(__dirname, '../data/bills.json');

function appendBillEntry(time, finalTotal) {
  const date = new Date().toISOString().split('T')[0];
  const entry = { time, final: finalTotal };
  let data = {};

  if (fs.existsSync(BILL_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(BILL_FILE, 'utf-8'));
    } catch {
      data = {};
    }
  }

  if (!data[date]) data[date] = [];
  data[date].push(entry);
  fs.writeFileSync(BILL_FILE, JSON.stringify(data, null, 2));
}

exports.renderBillingPage = (req, res) => {
  res.render('billing');
};

exports.handleBilling = async (req, res) => {
  try {
    const items = JSON.parse(req.body.items);
    const overallDiscount = parseFloat(req.body.discount || 0);
    const names = items.map(i => i.name);
    const products = await Product.find({ name: { $in: names } });

    const billItems = items.map(item => {
      const product = products.find(p => p.name === item.name);
      const baseRate = product ? product.rate : 0;
      const discount = parseFloat(item.discount || 0);
      const hike = parseFloat(item.hike || 0);
      const effectiveRate = baseRate * (1 - discount / 100) * (1 + hike / 100);
      const amount = item.quantity * baseRate;

      return {
        name: item.name,
        quantity: item.quantity,
        baseRate,
        discount,
        hike,
        effectiveRate: parseFloat(effectiveRate.toFixed(2)),
        amount: parseFloat(amount.toFixed(2)),
      };
    });

    const total = billItems.reduce((sum, i) => sum + i.amount, 0);
    const finalTotal = total - (overallDiscount / 100) * total;
    const now = new Date().toTimeString().split(' ')[0];

    appendBillEntry(now, parseFloat(finalTotal.toFixed(2)));

    res.render('billpreview', {
      bill: {
        items: billItems,
        total,
        discount: overallDiscount,
        finalTotal: parseFloat(finalTotal.toFixed(2)),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('⚠️ Server error during billing');
  }
};

exports.renderBillingHistory = (req, res) => {
  let bills = {};
  try {
    if (fs.existsSync(BILL_FILE)) {
      bills = JSON.parse(fs.readFileSync(BILL_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error("Error reading bills file", err);
  }

  const grouped = {};
  for (const date in bills) {
    grouped[date] = { bills: [], total: 0 };
    bills[date].forEach(bill => {
      grouped[date].bills.push({ time: bill.time, final: bill.final });
      grouped[date].total += bill.final;
    });
  }

  res.render('billing-history', { grouped });
};
