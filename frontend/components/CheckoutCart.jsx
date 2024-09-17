"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutCart = () => {
  const { userCart } = useCart();

  const handleCheckout = async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: userCart.courses.map((item) => ({
          name: item.title,
          quantity: 1,
          price: item.price,
          courseId: item.documentId,
        })),
        token: localStorage.getItem('token'),
        cartId: userCart.documentId
      }),
    });

    const { id } = await response.json();
    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId: id });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
      <Button
        onClick={handleCheckout}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Checkout with Stripe
      </Button>
    </div>
  );
};

export default CheckoutCart;
