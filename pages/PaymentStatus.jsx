import React, { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link"; // Import Link component from Next.js

// Load your publishable key from an environment variable or a config file
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const PaymentStatus = () => {
  const stripe = useStripe();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    const paymentIntent = new URLSearchParams(window.location.search).get(
      "payment_intent"
    );

    console.log("paymentIntent is ", paymentIntent);
    console.log("payment_intent_client_secret is ", clientSecret);

    // Retrieve the PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log("paymentIntent is ", paymentIntent);
      // Inspect the PaymentIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (paymentIntent.status) {
        case "succeeded":
          console.log("PaymentStatus Payment succeeded!");
          setMessages([
            "Success! Payment received.",
            "付款成功！",
            "Please save this access_key carefully and use it to access My ChatGPT Web, it will not be displayed again : " +
              paymentIntent.id,
            "请妥善保存这个访问密码，并用它来访问My ChatGPT Web，它不会再次显示 ：" + paymentIntent.id,
          ]);
          break;

        case "processing":
          console.log("PaymentStatus Payment processing.");
          setMessages([
            "Payment processing. We'll update you when payment is received.",
          ]);
          break;

        case "requires_payment_method":
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          console.log("Payment failed. Please try another payment method.");
          setMessages(["Payment failed. Please try another payment method."]);
          break;

        default:
          console.log("Something went wrong.");
          setMessages(["Something went wrong."]);
          break;
      }
    });
  }, [stripe]);

  // Add a return to home button using Link component
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              {messages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
              <Link href="https://chat.bizoe.tech/#/settings" as="https://chat.bizoe.tech/#/settings" legacyBehavior>
                <a className="btn btn-primary">设置访问密码</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentStatus />
    </Elements>
  );
};

export default App;
