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
    security_credential: '<Security Credential>'
}


async function makePayment({ phoneNumber, amount, reference }) {
    
    console.log(mpesaConfig)
    transaction = new Mpesa(mpesaConfig)
    
    const response = await transaction.c2b({
        amount: amount,
        msisdn: phoneNumber,
        reference: reference,
        third_party_reference: Date.now().toString()
      });
  return response;
}

module.exports = { makePayment };
