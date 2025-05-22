const Product = require('../models/product');
const Bill = require('../models/bill');



const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// In your billing handler function
 const generatePDF = (billData, res) => {
  const doc = new PDFDocument({ size: 'A6', margin: 20 });
  const filePath = path.join(__dirname, '..', 'public', 'bills', `bill-${Date.now()}.pdf`);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Header
  doc.fontSize(16).text("SRI SAI KRISHNA ENTERPRISES", { align: 'center' });
  doc.moveDown();

  // Items
  billData.items.forEach(item => {
    doc.fontSize(10).text(`${item.name} x ${item.quantity} @ ₹${item.price} = ₹${item.quantity * item.price}`);
  });

  doc.moveDown();
  doc.fontSize(12).text(`Total: ₹${billData.total}`);
  doc.fontSize(12).text(`Discount: ${billData.discount}%`);
  const finalTotal = billData.total - (billData.total * billData.discount / 100);
  doc.font('Helvetica-Bold').fontSize(14).text(`Final Total: ₹${finalTotal.toFixed(2)}`);

  doc.end();

  stream.on('finish', () => {
    res.download(filePath);
  });
};


exports.renderBillingHistory = async (req, res) => {
  try {
    // Fetch all bills, sorted by creation date descending
    const bills = await Bill.find({}).sort({ createdAt: -1 });

    // Group bills by date (yyyy-mm-dd)
    const grouped = bills.reduce((acc, bill) => {
      const date = bill.createdAt.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(bill);
      return acc;
    }, {});

    res.render('billingHistory', { grouped });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.renderBillingPage = (req, res) => {
  res.render('billing');
};

exports.handleBilling = async (req, res) => {
  try {
    const items = JSON.parse(req.body.items); // list of { name, quantity }
    const discount = parseFloat(req.body.discount || 0);
    let total = 0;

    for (let item of items) {
      const product = await Product.findOne({ name: item.name });

      if (!product || product.quantity < item.quantity) {
        return res.send(`❌ Insufficient stock or product not found: ${item.name}`);
      }

      item.price = product.price;
      total += item.price * item.quantity;

      product.quantity -= item.quantity;
      await product.save();
    }

    // Optional: Save to billing history DB (next step)
    generatePDF({ items, total, discount }, res);

  } catch (err) {
    console.error(err);
    res.status(500).send('⚠️ Server error during billing');
  }
};

exports.confirmBill = async (req, res) => {
  const { items, discount } = req.body;
  const parsedItems = JSON.parse(items);
  const detailedItems = [];
  let total = 0;

  for (const item of parsedItems) {
    const product = await Product.findOne({ name: item.name });
    if (!product || product.quantity < item.quantity) continue;

    const price = product.price * item.quantity;
    total += price;

    detailedItems.push({
      name: product.name,
      quantity: item.quantity,
      price: product.price
    });

    product.quantity -= item.quantity;
    await product.save();
  }

  const finalTotal = total - (total * discount / 100);
  const billData = {
    items: detailedItems,
    total,
    discount,
    finalTotal
  };

  // Save to DB
  const bill = new Bill({
    date: new Date(),
    items: detailedItems,
    total,
    discount,
    finalTotal
  });
  await bill.save();

  // Generate PDF (optional)
  // await generatePDF(billData, res); // optional - for now, we can render EJS

  res.render('billPreview', { bill: billData }); // create this EJS file
};
