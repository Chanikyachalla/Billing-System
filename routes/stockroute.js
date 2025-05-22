const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockcontroller');

router.get('/', stockController.renderStockPage);
router.post('/add', stockController.addOrUpdateProduct);

module.exports = router;

