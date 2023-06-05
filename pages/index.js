import React from "react"; 
import { loadStripe } from "@stripe/stripe-js"; 
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../components/CheckoutForm";

// This is your test publishable API key. 
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App() {
    const [products, setProducts] = React.useState([]); 
    const [selectedProduct, setSelectedProduct] = React.useState(null); 
    const [clientSecret, setClientSecret] = React.useState("");

    React.useEffect(() => { 
        // Fetch products from the server 
        fetch("/api/products") .then((res) => res.json()) .then((data) => setProducts(data)); }, []);

    const handleSelectProduct = (product) => { 
        // Set the selected product 
        setSelectedProduct(product); 
        // Create a PaymentIntent with the product price and currency 
        fetch(
            "/api/create-payment-intent", 
            { 
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ product }), 
            }
        ) .then((res) => res.json()) .then((data) => setClientSecret(data.clientSecret)); };

    const appearance = { theme: 'stripe', }; 
    const options = { clientSecret, appearance, };
    
    

    return ( 
        <div className="App"> 
            <h1>Choose a product</h1> 
            <div className="products"> 
                {products.map((product) => ( 
                    <div key={product.product.id} className="product"> 
                        <h2>{product.product.name}</h2> 
                        <p>
                            {product.product.description} {product.price / 100}{" "}
                            {product.currency === "cny"
                                ? "人民币"
                                : product.currency === "hkd"
                                ? "港币"
                                : product.currency === "usd"
                                ? "美元"
                                : product.currency === "eur"
                                ? "欧元"
                                : product.currency}
                        </p>

                        <p></p> 
                        <button onClick={() => handleSelectProduct(product)}>Proceed</button> 
                    </div> ))} 
            </div> 
            {clientSecret && selectedProduct && ( <Elements options={options} stripe={stripePromise}> <CheckoutForm product={selectedProduct} /> </Elements> )} 
        </div> ); 
    
}