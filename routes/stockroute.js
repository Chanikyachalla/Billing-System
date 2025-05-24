const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockcontroller');

router.get('/', stockController.renderStockPage);
router.post('/add', stockController.addOrUpdateProduct);
router.get('/products', stockController.searchProduct); // Live search suggestions
router.get('/stock-product', stockController.getProductDetails); // Fetch full product details
router.post('/update', stockController.updateProduct);
router.delete('/delete', stockController.deleteProduct);

module.exports = router;
