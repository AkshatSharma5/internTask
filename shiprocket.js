const crypto = require('crypto');
const axios = require('axios');
const CryptoJS = require("crypto-js");

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const sellerId = process.env.SELLER_ID;

const checkoutUrl = 'https://checkout-api.shiprocket.com/api/v1/access-token/checkout';
const orderDetailsUrl = 'https://checkout-api.shiprocket.com/api/v1/custom-platform-order/details';

// Function to calculate HMAC SHA-256 in base64 format
const calculateHmacSha256AsBase64 = (key, content) => {
  // Calculate the HMAC using SHA-256 with the key and content
  const hmac = CryptoJS.HmacSHA256(content, key).toString(CryptoJS.enc.Hex);

  // Convert the Hex formatted HMAC to Base64
  const calculatedHmacBase64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(hmac));

  return calculatedHmacBase64;
};

// Generate access token
async function generateAccessToken() {
  const timestamp = new Date().toISOString();
  
  // Generate HMAC using the request body and secret key
  const hmac = calculateHmacSha256AsBase64(apiSecret, JSON.stringify({
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
  }));

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
    console.log(response.data.result.token,": token")
    return response.data.result.token;
  } catch (error) {
    console.error('Error generating token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Fetch order details
async function getOrderDetails(orderId) {
  const timestamp = new Date().toISOString();
  
  // Generate HMAC using the request body and secret key
  const hmac = calculateHmacSha256AsBase64(apiSecret, JSON.stringify({
    order_id: orderId,
    timestamp: timestamp,
  }));

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
