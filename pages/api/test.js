import Cors from 'micro-cors';
const axios = require('axios');



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
        axios.post('https://service.bizoe.tech/v1/recharge', { 
            paymentIntentId: "pi_3NGNufCMTeU4V8Iq1NYbBkX2", 
            amount: 400, 
            product_id: "prod_O2DnzwF8ZK5VJ0", 
        })
        .then(response => {
          console.log("Recharge request succeeded: response data is ", response.data);
        })
        .catch(error => {
          // Handle error response
          console.log(`Recharge request failed: ${error.message}`);
        });
        console.log('Recharge request succeeded: response data is ', result.data);
        res.status(201).json(result.data);
    } catch (error) {
        // Handle error response
        console.log(`Recharge request failed: ${error.message}`);
        res.status(500).json(error.message);
    }
}
