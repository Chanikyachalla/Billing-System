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
      return res.status(400).json({ error: "All fields are required" });
    }

    let product = await Product.findOne({ name });

    if (product) {
      product.price = price;
      product.quantity += Number(quantity);
    } else {
      product = new Product({ name, price, quantity });
    }

    await product.save();
    res.json({ success: true, message: "Product added/updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({ name: { $regex: query, $options: "i" } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Product name is missing" });

    const product = await Product.findOne({ name });
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Error fetching product details:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const product = await Product.findOne({ name });

    if (!product) return res.status(404).json({ error: "Product not found" });

    product.price = price;
    product.quantity = quantity;
    await product.save();

    res.json({ success: true, message: "Product updated", product });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await Product.deleteOne({ name });

    if (result.deletedCount === 0) return res.status(404).json({ error: "Product not found" });

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
