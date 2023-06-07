import Stripe from 'stripe';
import { buffer } from 'micro';
import Cors from 'micro-cors';
const axios = require('axios');
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
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        signature,
        webhookSecret
      );
    } catch (err) {
      // On error, log and return the error message.
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntentId = event.data.object.id;
        // Retrieve the full PaymentIntent object by its ID using Stripe API
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log(`PaymentIntent `, paymentIntent)
        console.log(`PaymentIntent id: ${paymentIntentId}`)
        console.log(`PaymentIntent status: ${paymentIntent.status}`);
        // Retrieve the PaymentIntent ID from the event data
        const amount = paymentIntent.amount
        const product_id = paymentIntent.metadata.product_id
        console.log(`amount:`, amount);
        console.log(`product_id:`, product_id);
        
        axios.post('https://service.bizoe.tech/v1/recharge', { 
            paymentIntentId: paymentIntentId, 
            amount: amount, 
            product_id: product_id, 
        })
        .then(response => {
          console.log("Recharge request succeeded: response data is ", response.data);
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
        console.log("🔔  Payment received!");
        break;
      }
      case 'checkout.session.async_payment_succeeded':{
        console.log("🔔  Async Payment received!");
        break;
      }
      case 'checkout.session.async_payment_failed':{
        console.log("🔔  Async Payment failed!");
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