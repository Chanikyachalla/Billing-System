const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Port = 3000;






const apiRoutes = require('./routes/apiRoutes');
const homeRoutes = require('./routes/homeroute');
const billingRoutes = require('./routes/billingRoutes');
const stockRoutes = require('./routes/stockroute');

const app = express();

app.listen(Port, () => {
  console.log(`✅ Server started at http://localhost:${Port}`);
});





// Connect to DB & Start Server
mongoose.connect('mongodb://127.0.0.1:27017/hardware_inventory', {
  
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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
// app.get("/chat/stock", (req, res)=>{
//   const {price , hickedPrice } = req.body;
//   function  total (asyncs , await )
// })



