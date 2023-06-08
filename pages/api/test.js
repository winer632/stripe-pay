import Cors from 'micro-cors';
const axios = require('axios');


async function test() {
    console.log("[test] begin ");
    const result = await fetch("https://service.bizoe.tech/v1/recharge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentIntentId: "pi_3NGNufCMTeU4V8Iq1NYbBkX2", 
        amount: 400, 
        product_id: "prod_O2DnzwF8ZK5VJ0",
      }),
    })
    .then((result) => {
        // Use json() method to parse response body as JSON
        console.log("[test] charge request result is ", result);
    })
    .then((data) => {
        // Now data is an object with data property
        console.log("[test] charge request succeeded: response data is ", data);
    })
    .catch((error) => {
        console.error("[test] charge request failed: error is ", error);
    });
    console.log("[test] end ");
    return result.json();
}

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

    test();

}
