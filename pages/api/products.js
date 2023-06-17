// This is your test secret API key. 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) { 
    // List products from Stripe 
    const products = await stripe.products.list({ active: true }); 
    // Map products to include prices 
    const productsWithPrices = await Promise.all( 
        products.data.map(
            async (product) => { 
                // Get the first price for each product 
                const price = await stripe.prices.list({ product: product.id, limit: 1, }); 
                return { 
                    product, 
                    price: price.data[0].unit_amount, 
                    currency: price.data[0].currency, 
                }; 
            }
        ) 
    ); 
    
    res.send(productsWithPrices); 
};