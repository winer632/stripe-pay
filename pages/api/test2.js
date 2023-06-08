import Stripe from 'stripe';
import { buffer } from 'micro';
import Cors from 'micro-cors';
const https = require('https');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
 api: {
 bodyParser: false,
 },
};

const cors = Cors({
 allowMethods: ['POST', 'HEAD'],
});


const webhookHandler = async (req, res) => {
    if (req.method === 'POST') {
        let event;
        event.type = 'payment_intent.succeeded';
        switch (event.type) {
            case 'payment_intent.succeeded': {
                // Use fetch method instead of axios
                fetch('https://service.bizoe.tech/v1/recharge', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentIntentId: "pi_3NGNufCMTeU4V8Iq1NYbBkX2", 
                        amount: 400, 
                        product_id: "prod_O2DnzwF8ZK5VJ0",
                    })
                })
                .then(response => {
                    console.log("Recharge request response status: ", response.status);
                    return response.json();
                })
                .then(data => {
                    console.log("Recharge request succeeded: response data is ", data);
                })
                .catch(error => {
                    // Handle error response
                    console.log(`Recharge request failed: ${error.message}`);
                });
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                console.log(
                    `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
                );
                break;
            }
            case 'charge.succeeded': {
                const charge = event.data.object;
                console.log(`charge.succeeded， Charge id: ${charge.id}`);
                break;
            }
            case 'checkout.session.completed':{
                console.log("🔔 Payment received!");
                break;
            }
            case 'checkout.session.async_payment_succeeded':{
                console.log("🔔 Async Payment received!");
                break;
            }
            case 'checkout.session.async_payment_failed':{
                console.log("🔔 Async Payment failed!");
                break;
            }
            default: {
                console.warn(`Unhandled event type: ${event.type}`);
                break;
            }
        }

        // Return a response to acknowledge receipt of the event.
        res.json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};

export default cors(webhookHandler);
