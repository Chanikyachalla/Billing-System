const Product = require('../models/product');

exports.renderStockPage = async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('stock', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.addOrUpdateProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    if (!name || !price || !quantity) {
      return res.status(400).send('All fields are required');
    }

    // Check if product exists
    let product = await Product.findOne({ name });

    if (product) {
      // Update price & quantity
      product.price = price;
      product.quantity += Number(quantity);
      await product.save();
    } else {
      // Add new product
      product = new Product({ name, price, quantity });
      await product.save();
    }
    res.redirect('/stock');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
