const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { makePayment } = require('./mpesaService');

dotenv.config();

const app = express();
const allowedOrigins = ['https://yourtrusteddomain.com'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());

// Middleware para veruficar campos
function validatePaymentFields(req, res, next) {
    const { phoneNumber, amount, reference } = req.body;

    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return res.status(400).json({ error: 'Número de telefone inválido ou ausente.' });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Montante inválido ou ausente.' });
    }
    if (!reference || typeof reference !== 'string') {
        return res.status(400).json({ error: 'Referência inválida ou ausente.' });
    }

    next();
}

app.post('/api/pay', validatePaymentFields, async (req, res) => {
    try {
        const { phoneNumber, amount, reference } = req.body;

        const response = await makePayment({ phoneNumber, amount, reference });
        res.json({ success: true, mpesaResponse: response });
    } catch (err) {
        console.error('Erro de Pagamento Mpesa:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor Mpesa rodando na porta ${PORT}`);
});
