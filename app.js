const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const apiRoutes = require('./routes/apiRoutes');
const homeRoutes = require('./routes/homeroute');
const billingRoutes = require('./routes/billingRoutes');
const stockRoutes = require('./routes/stockroute');

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Routes
app.use('/', homeRoutes);
app.use('/billing', billingRoutes);
app.use('/stock', stockRoutes);
app.use('/api', apiRoutes);

module.exports = app;