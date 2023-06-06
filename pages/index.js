import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";

import CheckoutForm from "../components/CheckoutForm";

// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App() {
  const [products, setProducts] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [clientSecret, setClientSecret] = React.useState("");

  // Use Next.js router to get the product id from the query string
  const router = useRouter();
  const { productId } = router.query;

  React.useEffect(() => {
    // Fetch products from the server
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  React.useEffect(() => {
    // If there is a product id in the query string, find the matching product
    if (productId) {
      const product = products.find((p) => p.product.id === productId);
      if (product) {
        // Set the selected product
        setSelectedProduct(product);
        // Create a PaymentIntent with the product price and currency
        fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product }),
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret));
      }
    }
  }, [productId, products]);

  const handleSelectProduct = (product) => {
    // Redirect to a new page with the product id as a query parameter
    router.push(`/?productId=${product.product.id}`);
  };

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    <div className="App">
      {/* Only show the h1 element when there is no product id in the query string */}
      {!productId && <h1>Choose a plan</h1>}
      {/* Only show the products list and their proceed buttons when there is no product id in the query string */}
      {!productId && (
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
              <button onClick={() => handleSelectProduct(product)}>
                Proceed
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Only show the selected product info and the CheckoutForm when there is a product id in the query string */}
      {clientSecret && selectedProduct && (
        <>
          <div className="selected-product">
            <h2>{selectedProduct.product.name}</h2>
            <p>
              {selectedProduct.product.description}{" "}
              {selectedProduct.price / 100}{" "}
              {selectedProduct.currency === "cny"
                ? "人民币"
                : selectedProduct.currency === "hkd"
                ? "港币"
                : selectedProduct.currency === "usd"
                ? "美元"
                : selectedProduct.currency === "eur"
                ? "欧元"
                : selectedProduct.currency}
            </p>
          </div>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm product={selectedProduct} />
          </Elements>
        </>
      )}
    </div>
  );


}
