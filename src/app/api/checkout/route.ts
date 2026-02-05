import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-01-28.clover',
    });
  }
  return stripeInstance;
}

// Pricing: 8€ = 6 pokeballs + 2€ crowdfund
const PRICE_PER_POKEBALL = 8 / 6; // ~1.33€
const CROWDFUND_PER_POKEBALL = 2 / 6; // ~0.33€

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, boxId, userId, pokeballs } = body;

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Calculate pokeballs if not provided
    const calculatedPokeballs = pokeballs || Math.round(amount / PRICE_PER_POKEBALL);
    const crowdfundAmount = (calculatedPokeballs * CROWDFUND_PER_POKEBALL).toFixed(2);

    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(amount * 100), // Convert to cents
            product_data: {
              name: `${calculatedPokeballs} Pokeballs`,
              description: `Recibes ${calculatedPokeballs} Pokeballs + ${crowdfundAmount}€ van al crowdfunding`,
              images: ['https://rykoi.vercel.app/pokeball.png'],
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rykoi.vercel.app'}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rykoi.vercel.app'}?canceled=true`,
      metadata: {
        boxId: boxId || '',
        userId: userId || '',
        pokeballs: calculatedPokeballs.toString(),
        crowdfundAmount: crowdfundAmount,
        amountEuros: amount.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
