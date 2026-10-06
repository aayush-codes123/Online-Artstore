import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Truck, 
  AlertCircle 
} from "lucide-react";
import Navbar from "../components/Navbar";

// Load Stripe publishable key
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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to initiate payment transaction.");
      }

      const { clientSecret } = data;

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

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Create the order in backend
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
          setError(orderData.message || "Payment processed, but order creation recorded an issue.");
        }
      }
    } catch (err) {
      setError(err.message || "Payment processing failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Card Information (Stripe Secure)
        </label>
        <div className="p-4 rounded-xl bg-zinc-950/90 border border-white/10 text-white shadow-inner">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  color: "#ffffff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  "::placeholder": {
                    color: "#71717a",
                  },
                },
                invalid: {
                  color: "#f87171",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 space-y-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <Lock className="w-4 h-4 shrink-0" />
          <span>256-Bit Encrypted Escrow Transfer</span>
        </div>
        <p>
          Funds remain protected in verified escrow until your artwork is authenticated and successfully delivered to your shipping address.
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 rounded-full bg-white text-zinc-950 font-bold text-sm transition hover:bg-zinc-200 active:scale-95 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4" />
        <span>{loading ? "Processing Secure Transfer..." : `Authorize Rs. ${Number(artwork.price).toLocaleString()}`}</span>
      </button>
    </form>
  );
};

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md p-8 rounded-2xl bg-zinc-900 border border-white/10 space-y-4">
          <CreditCard className="w-10 h-10 text-zinc-500 mx-auto" />
          <h2 className="text-xl font-bold text-white font-serif-title">No Acquisition Order Found</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Please select an artwork from the gallery to begin the acquisition checkout.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Gallery</span>
          </Link>
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
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 selection:bg-amber-400/20 selection:text-amber-200">
      <Navbar />

      <main className="pt-32 pb-24 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Collector & Delivery</span>
            </div>
            <div className="h-[1px] flex-1 mx-4 bg-emerald-500/40" />
            <div className="flex items-center gap-2 text-white">
              <span className="w-6 h-6 rounded-full bg-white text-zinc-950 flex items-center justify-center text-xs font-bold">2</span>
              <span>Payment & Escrow</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          {/* Left Column: Acquisition Recap */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/60 backdrop-blur-md p-6 space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-20 h-20 rounded-xl object-cover border border-white/10 bg-black"
              />
              <div>
                <span className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">
                  Original Artwork
                </span>
                <h3 className="text-lg font-bold text-white font-serif-title line-clamp-1">
                  {artwork.title}
                </h3>
                <p className="text-xs text-zinc-400">
                  {artwork.sellerName || artwork.seller?.fullName || "Verified Creator"}
                </p>
              </div>
            </div>

            {/* Delivery address confirmation */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                <Truck className="w-3.5 h-3.5 text-amber-300" />
                <span>Courier Destination</span>
              </div>
              <p className="text-white font-medium">{formData.fullName}</p>
              <p className="text-zinc-400">{formData.address}</p>
              <p className="text-zinc-400">Contact: {formData.contactNumber}</p>
            </div>

            {/* Total recap */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-zinc-200">Rs. {Number(artwork.price).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Archival Handling & Transit</span>
                <span className="text-emerald-400">Complimentary</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Authorized</span>
                <span>Rs. {Number(artwork.price).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Stripe Checkout or Success */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-md p-8 space-y-6">
            <div>
              <span className="text-amber-300 text-xs font-bold uppercase tracking-[0.2em]">Step 2 of 2</span>
              <h3 className="text-2xl font-bold text-white font-serif-title mt-1">
                Complete Payment
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your card details below to finalize acquisition and initiate courier dispatch.
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif-title">
                  Acquisition Confirmed!
                </h3>
                <p className="text-xs text-emerald-200 max-w-md mx-auto leading-relaxed">
                  Your payment has cleared into secure escrow. The artist has been notified to seal and dispatch your certificate and artwork.
                </p>
                <p className="text-[11px] text-zinc-400 pt-2">
                  Redirecting back to gallery archive...
                </p>
              </motion.div>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm artwork={artwork} formData={formData} onSuccess={handleSuccess} />
              </Elements>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Payment;
