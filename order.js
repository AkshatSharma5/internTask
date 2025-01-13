const orderDetailsUrl = 'https://checkout-api.shiprocket.com/api/v1/custom-platform-order/details';

async function getOrderDetails(orderId) {
  const timestamp = new Date().toISOString();
  const hmacData = `${apiKey}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', apiSecret).update(hmacData).digest('base64');

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
    console.log('Order Details:', response.data);
  } catch (error) {
    console.error('Error fetching order details:', error.response ? error.response.data : error.message);
  }
}

// Example usage
getOrderDetails('65a000df3fc6c468b9da1f53');
