const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { makePayment } = require('./mpesaService');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/pay', async (req, res) => {
  try {
    const { phoneNumber, amount, reference } = req.body;

    if (!phoneNumber || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await makePayment({ phoneNumber, amount, reference });
    res.json({ success: true, mpesaResponse: response });
  } catch (err) {
    console.error('Mpesa Payment Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Mpesa server running on port ${PORT}`);
});
