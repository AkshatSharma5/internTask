const crypto = require('crypto');
const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config();
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjU2NjI1MDcsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzM3NjM3ODMyLCJqdGkiOiJjakFrcHkwMVhCbDJPSkJwIiwiaWF0IjoxNzM2NzczODMyLCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTczNjc3MzgzMiwiY2lkIjoxMzI5NjEwLCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.5W-XVV7g8GjZNwKhpxPYJamiqM3uLhnNfqQZHk-ddLQ";
const apiSecret = process.env.SECRET;
const checkoutUrl = 'https://checkout-api.shiprocket.com/api/v1/access-token/checkout';

async function generateAccessToken() {
  const timestamp = new Date().toISOString();
  const hmacData = `${apiKey}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', apiSecret).update(hmacData).digest('base64');
  console.log("hmac",hmac)

  const body = {
    cart_data: {
      items: [
        {
          variant_id: '1244539923890450',
          quantity: 1,
        },
      ],
    },
    redirect_url: 'https://your-domain.requestcatcher.com/?anyparam=anyvalue&more=2',
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
    console.log('Token Response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Error generating token:', error.response ? error.response.data : error.message);
  }
}

generateAccessToken();
