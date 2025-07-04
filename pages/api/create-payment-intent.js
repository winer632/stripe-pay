// This is your test secret API key. 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) { 
    const { product } = req.body;
    console.log(product);
    console.log(product.product.id);
    console.log(typeof(product.product.id));
    
    // Create a PaymentIntent with the product price and currency 
    const paymentIntent = await stripe.paymentIntents.create({ 
        amount: product.price, 
        currency: product.currency, 
        automatic_payment_methods: { enabled: true, }, 
        metadata:{ product_id: product.product.id, }, 
    });
    console.log(`create-payment-intent paymentIntent is `, paymentIntent);
    res.send({ clientSecret: paymentIntent.client_secret, }); 
};