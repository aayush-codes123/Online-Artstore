import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51SXkxf7swrRHPTMyJ97vB1S3cMr4yqo2csZrFd573sUKXec8yJTj6L1G6OcZC82yPIHySwXYPK3ncVMXfDBUXqnw00Kgz2XGDg");

const CheckoutForm = ({ artwork, formData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Create PaymentIntent on the server
      const response = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: artwork.price,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Payment successful, now create the order
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            artworkId: artwork._id,
            amount: artwork.price,
            buyerName: formData.fullName,
            shippingAddress: formData.address,
            contactNumber: formData.contactNumber,
            paymentStatus: "Paid",
          }),
        });

        const orderData = await orderRes.json();
        if (orderRes.ok) {
          onSuccess();
        } else {
          setError(orderData.message || "Order placement failed");
        }
      }
    } catch (err) {
      setError("Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-700 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-400 mb-2">Card Details</label>
        <div className="bg-white p-3 rounded">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl shadow-lg transition"
      >
        {loading ? "Processing..." : `Pay Rs. ${artwork.price}`}
      </motion.button>
    </form>
  );
};

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">No order details found.</p>
          <button
            onClick={() => navigate("/explore")}
            className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Go to Explore
          </button>
        </div>
      </div>
    );
  }

  const { artwork, formData } = state;

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => navigate("/explore"), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-3xl font-bold mb-6 text-purple-400 text-center">Payment</h2>

        <div className="mb-6 text-left bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-300">Total Amount:</p>
          <p className="text-2xl font-bold text-white">Rs. {artwork.price}</p>
          <div className="mt-2 border-t border-gray-600 pt-2">
            <p className="text-sm text-gray-400">Artwork: {artwork.title}</p>
            <p className="text-sm text-gray-400">Shipping to: {formData.address}</p>
          </div>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-600/20 text-green-300 p-6 rounded-lg text-center"
          >
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p>Order confirmed. Check your email for details.</p>
            <p className="text-sm mt-2">Redirecting to explore...</p>
          </motion.div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm artwork={artwork} formData={formData} onSuccess={handleSuccess} />
          </Elements>
        )}
      </motion.div>
    </div>
  );
};

export default Payment;
