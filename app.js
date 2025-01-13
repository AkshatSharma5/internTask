const express = require('express');
const app = express();
const cors=require('cors')

app.use(cors());

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

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
