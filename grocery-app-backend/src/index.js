const express = require('express');
const cors = require('cors');
const productRoutes = require('./api/products');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
