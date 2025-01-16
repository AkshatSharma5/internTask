const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const { generateAccessToken, getOrderDetails } = require('./shiprocket');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  // Send the HTML file as the response
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Success redirect route
app.get('/order-success', (req, res) => {
  const orderId = req.query.oid;
  const orderStatus = req.query.ost;

  if (orderStatus === 'SUCCESS') {
    console.log(`Order ${orderId} placed successfully.`);
    res.sendFile(path.join(__dirname,'success.html'));
  } else {
    console.log(`Order ${orderId} failed with status: ${orderStatus}`);    
    res.sendFile(path.join(__dirname,'error.html'));
  }
});





// API route to fetch order details
app.get('/fetch-order-details', async (req, res) => {
  const { orderId } = req.query;
  if (!orderId) {
    // return res.status(400).send('Missing order ID.');
    console.log('Missing order ID.')
    return res.status(400).sendFile(path.join(__dirname,'error.html'));
  }

  try {
    const details = await getOrderDetails(orderId);
    console.log(details.data)
    res.json(details);
  } catch (error) {
    // res.status(500).json({ error: 'Failed to fetch order details', details: error.message });
    console.log({ error: 'Failed to fetch order details', details: error.details })
    res.status(500).sendFile(path.join(__dirname,'error.html'));
  }
});




// Route to generate token
app.get('/generate-token', async (req, res) => {
  try {
    const token = await generateAccessToken();
    res.status(200).sendFile(path.join(__dirname,"./tokenPage.html"));
  } catch (error) {
    // res.status(500).json({ error: 'Failed to generate token', details: error.message });
    console.log({ error: 'Failed to generate token', details: error.message });
    return res.status(500).sendFile(path.join(__dirname,'error.html'));
  }
});




app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'cart.html'));
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'success.html'));
});

app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'error.html'));
});

app.get('/my-order-details', (req, res) => {
  res.sendFile(path.join(__dirname, 'orderDetails.html'));
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
