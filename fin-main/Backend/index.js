const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Import route
const loginRoute = require('./login');
const productRoutes = require('./products')
const customerRoutes = require('./customers')
// Kết nối MongoDB
mongoose.connect(
    "mongodb+srv://antaduychinh:abcxyz04@fashionshop.qdyue.mongodb.net/fashion?retryWrites=true&w=majority&appName=Fashionshop"
);

// Routes
app.use('/api', loginRoute);
app.use('/products', productRoutes);
app.use('/customers', customerRoutes);

app.listen(3000, () => {
    console.log("Connect successfully!");
});
