import React, {useState, useEffect} from 'react';
import {useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import Link from 'next/link'; // Import Link component from Next.js

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
      'payment_intent_client_secret'
    );

    const paymentIntentId = new URLSearchParams(window.location.search).get(
        'payment_intent'
      );

    // Retrieve the PaymentIntent
    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({paymentIntent}) => {
        // Inspect the PaymentIntent `status` to indicate the status of the payment
        // to your customer.
        //
        // Some payment methods will [immediately succeed or fail][0] upon
        // confirmation, while others will first enter a `processing` state.
        //
        // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessages([
              'Success! Payment received.',
              '付款成功！',
              'Please save this access_key carefully and use it to access My ChatGPT Web, it will not be displayed again : ' + paymentIntentId,
              '请妥善保存这个访问密码，并用它来访问My ChatGPT Web，它不会再次显示 ：' + paymentIntentId
            ]);
            break;

          case 'processing':
            setMessages(["Payment processing. We'll update you when payment is received."]);
            break;

          case 'requires_payment_method':
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            setMessages(['Payment failed. Please try another payment method.']);
            break;

          default:
            setMessages(['Something went wrong.']);
            break;
        }
      });
  }, [stripe]);

  // Add a return to home button using Link component
  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
      <Link href="https://chat.bizoe.tech/#/settings">
        <a>设置访问密码</a>
      </Link>
    </div>
  );
};

// Load your publishable key from an environment variable or a config file
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentStatus />
    </Elements>
  );
};

export default App;
