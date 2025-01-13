const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const { generateAccessToken, getOrderDetails } = require('./shiprocket');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files like JS and CSS

// Home page route
app.get('/', (req, res) => {
  res.send();
});

// Success redirect route
app.get('/order-success', (req, res) => {
  const orderId = req.query.oid;
  const orderStatus = req.query.ost;

  if (orderStatus === 'SUCCESS') {
    console.log(`Order ${orderId} placed successfully.`);
    res.send('Thank you for your order!');
  } else {
    console.log(`Order ${orderId} failed with status: ${orderStatus}`);
    res.send('Order placement failed. Please try again.');
  }
});

// API route to fetch order details
app.get('/fetch-order-details', async (req, res) => {
  const { orderId } = req.query;
  if (!orderId) {
    return res.status(400).send('Missing order ID.');
  }

  try {
    const details = await getOrderDetails(orderId);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details', details: error.message });
  }
});

// Route to generate token
app.get('/generate-token', async (req, res) => {
  try {
    const token = await generateAccessToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate token', details: error.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
