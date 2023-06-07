import Cors from 'micro-cors';
const axios = require('axios');
const https = require('https');

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const agent = new https.Agent({ rejectUnauthorized: false });

// Define the handler function for the API route
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body;
        console.log("POST request", data);
    }
    if (req.method === 'GET') {
        const data = req.query;
        console.log("GET request", data);
    }

    // Add reservering in reserv table
    try {
        const result = await axios.post(
        'https://service.bizoe.tech/v1/validity',
        {
            access_key: 'some_valid_id',
        },
        {
            httpsAgent: agent, // Pass the custom https agent as an option
        }
        );
        console.log('Recharge request succeeded: response data is ', result.data);
        res.status(201).json(result.data);
    } catch (error) {
        // Handle error response
        console.log(`Recharge request failed: ${error.message}`);
        res.status(500).json(error.message);
    }
}
