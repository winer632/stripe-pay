import Cors from 'micro-cors';
const axios = require('axios');


async function test() {
    console.log("[test] begin ");
    // Add a return statement here
    return fetch("https://service.bizoe.tech/v1/recharge", {
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
        // Add a return statement here
        return result.json();
    })
    // Remove the second then() callback here
    .catch((error) => {
        console.error("[test] charge request failed: error is ", error);
    });
    console.log("[test] end ");
}

// Define the handler function for the API route
export default async function handler(req) {
    if (req.method === 'POST') {
        const data = req.body;
        console.log("POST request", data);
    }
    if (req.method === 'GET') {
        const data = req.query;
        console.log("GET request", data);
    }

    // Add an await keyword here
    const data = await test();

    // Check if data is defined and has a data property here
    if (data && data.data) {
        console.log("data.data is ", data.data);
      return data.data;
    } else {
      // Handle the case where data is not a valid object
      // For example, return an error message or a default value
      console.log("data is ", data);
      return { message: 'Something went wrong' };
    }
}
