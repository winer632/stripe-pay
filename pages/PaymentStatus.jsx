// Import React hooks
import React, { useState, useEffect } from "react";
// Import Stripe hooks and elements
import { useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// Import Link component from Next.js
import Link from "next/link";
// Import CopyButton component
import CopyButton from "../components/CopyButton";

// Load your publishable key from an environment variable or a config file
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const PaymentStatus = () => {
  const stripe = useStripe();
  const [messages, setMessages] = useState([]);
  // Declare and initialize the paymentIntent variable using useState hook
  const [paymentIntent, setPaymentIntent] = useState(null);

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
      // Set the paymentIntent state using setPaymentIntent function
      setPaymentIntent(paymentIntent);
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

  // Add some styles for the page elements
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f0f2f5",
    },
    card: {
      width: "80%",
      maxWidth: "600px",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#ffffff",
    },
    logo: {
      width: "200px",
      height: "auto",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#5469d4",
    },
    message: {
      fontSize: "18px",
      color: "#333333",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    // Add some styles for the settings button
    settingsButton: {
      width: "130px",
      height: "40px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#5469d4",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  // Add a return to home button using Link component
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Add a logo image */}
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        {/* Add a title */}
        <h1 style={styles.title}>Thank you for your purchase!</h1>
        {/* Show any messages */}
        {messages.map((message, index) => (
          <p key={index} style={styles.message}>
            {message}
          </p>
        ))}
        
        {/* Add a button container */}
        <div style={styles.buttonContainer}>
          {/* Use the CopyButton component with the access key and pass the paymentIntent as a prop */}
          {/* Only render the component if paymentIntent is not null */}
          {paymentIntent && <CopyButton text={paymentIntent.id} paymentIntent={paymentIntent} />}
          {/* Use the Link component with the settings url and pass the legacyBehavior prop */}
          {/* Change the <a> tag to a <button> tag and apply the style */}
          <Link href="https://chat.bizoe.tech/#/settings" as="https://chat.bizoe.tech/#/settings" legacyBehavior>
            <button style={styles.settingsButton}>设置访问密码</button>
          </Link>
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
