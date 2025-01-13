const crypto = require('crypto');
const axios = require('axios');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const sellerId = process.env.SELLER_ID;

const checkoutUrl = 'https://checkout-api.shiprocket.com/api/v1/access-token/checkout';
const orderDetailsUrl = 'https://checkout-api.shiprocket.com/api/v1/custom-platform-order/details';

// Generate HMAC function
function generateHmac(apiKey, apiSecret, timestamp) {
  const hmacData = `${apiKey}:${timestamp}`;
  return crypto.createHmac('sha256', apiSecret).update(hmacData).digest('base64');
}

// Generate access token
async function generateAccessToken() {
  const timestamp = new Date().toISOString();
  const hmac = generateHmac(apiKey, apiSecret, timestamp);

  const body = {
    cart_data: {
      items: [
        {
          variant_id: '1244539923890450',
          quantity: 1,
        },
      ],
    },
    redirect_url: 'https://your-redirect-url.com',
    timestamp: timestamp,
  };

  try {
    const response = await axios.post(checkoutUrl, body, {
      headers: {
        'X-Api-Key': apiKey,
        'X-Api-HMAC-SHA256': hmac,
        'Content-Type': 'application/json',
      },
    });
    return response.data.token;
  } catch (error) {
    console.error('Error generating token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Fetch order details
async function getOrderDetails(orderId) {
  const timestamp = new Date().toISOString();
  const hmac = generateHmac(apiKey, apiSecret, timestamp);

  const body = {
    order_id: orderId,
    timestamp: timestamp,
  };

  try {
    const response = await axios.post(orderDetailsUrl, body, {
      headers: {
        'X-Api-Key': apiKey,
        'X-Api-HMAC-SHA256': hmac,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { generateAccessToken, getOrderDetails };
