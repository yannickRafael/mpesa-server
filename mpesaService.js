// mpesaService.js
const { config } = require('dotenv');
const Mpesa = require('mpesa-mz-nodejs-lib');
require('dotenv').config();

const mpesaConfig = {
    public_key: process.env.MPESA_PUBLIC_KEY,
    api_host: process.env.MPESA_API_HOST,
    api_key: process.env.MPESA_API_KEY,
    origin: process.env.MPESA_API_ORIGIN,
    service_provider_code: process.env.MPESA_SERVICE_PROVIDER_CODE,
    initiator_identifier: process.env.MPESA_SERVICE_INITIATOR_IDENTIFIER,
    security_credential: process.env.MPESA_SECURITY_CREDENTIAL // Alterado para variável de ambiente
}

async function makePayment({ phoneNumber, amount, reference }) {
    try {
        const transaction = new Mpesa(mpesaConfig);

        console.log('Iniciando pagamento via Mpesa:', { phoneNumber, amount, reference });

        const response = await transaction.c2b({
            amount: amount,
            msisdn: phoneNumber,
            reference: reference,
            third_party_reference: Date.now().toString()
        });

        console.log('Resposta do Mpesa:', response);
        return response;
    } catch (error) {
        console.error('Erro ao processar pagamento via Mpesa:', error);
        throw new Error('Falha no processamento do pagamento. Por favor, tente novamente.');
    }
}

module.exports = { makePayment };
