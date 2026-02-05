import { loadStripe } from '@stripe/stripe-js';

// Load Stripe.js
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface CheckoutParams {
  amount: number;
  pokeballs: number;
  boxId?: string;
  userId?: string;
}

export async function redirectToCheckout({
  amount,
  pokeballs,
  boxId,
  userId,
}: CheckoutParams) {
  try {
    // Create checkout session on our server
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        pokeballs,
        boxId,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();

    // Redirect to Stripe Checkout
    if (url) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

export { stripePromise };
