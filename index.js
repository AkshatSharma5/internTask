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
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shiprocket Checkout</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: #fff;
        }
        .container {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 30px;
        }
        a {
          text-decoration: none;
          background: #fff;
          color: #2575fc;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 1rem;
          font-weight: bold;
          transition: background 0.3s, color 0.3s;
        }
        a:hover {
          background: #2575fc;
          color: #fff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Shiprocket Checkout</h1>
        <p>Your one-stop solution for seamless order management and checkout.</p>
        <a href="/generate-token">Generate Token</a>
      </div>
    </body>
    </html>
  `);
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
