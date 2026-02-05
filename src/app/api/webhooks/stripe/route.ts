import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;
let supabaseInstance: SupabaseClient | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-01-28.clover',
    });
  }
  return stripeInstance;
}

function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseInstance;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent failed:', paymentIntent.id);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { boxId, userId, pokeballs, crowdfundAmount, amountEuros } = session.metadata || {};
  const supabase = getSupabase();

  console.log('Processing successful payment:', {
    sessionId: session.id,
    boxId,
    userId,
    pokeballs,
    crowdfundAmount,
    amountEuros,
  });

  // If we have a boxId, this is a contribution
  if (boxId) {
    try {
      // Create contribution record
      const { data: contribution, error: contributionError } = await supabase
        .from('contributions')
        .insert({
          user_id: userId || null,
          box_id: boxId,
          amount_euros: parseFloat(amountEuros || '0'),
          pokeballs_received: parseInt(pokeballs || '0'),
          crowdfund_amount: parseFloat(crowdfundAmount || '0'),
          status: 'COMPLETED',
          stripe_payment_id: session.payment_intent as string,
        })
        .select()
        .single();

      if (contributionError) {
        console.error('Error creating contribution:', contributionError);
        return;
      }

      console.log('Contribution created:', contribution);

      // Update box's current_raised (manual update)
      const { data: currentBox } = await supabase
        .from('boxes')
        .select('current_raised, contributors_count')
        .eq('id', boxId)
        .single();

      if (currentBox) {
        await supabase
          .from('boxes')
          .update({
            current_raised: (currentBox.current_raised || 0) + parseFloat(crowdfundAmount || '0'),
            contributors_count: (currentBox.contributors_count || 0) + 1,
          })
          .eq('id', boxId);
      }

      // Update user's pokeballs if userId exists
      if (userId) {
        const { data: user } = await supabase
          .from('users')
          .select('pokeballs, total_contributed')
          .eq('id', userId)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({
              pokeballs: (user.pokeballs || 0) + parseInt(pokeballs || '0'),
              total_contributed: (user.total_contributed || 0) + parseFloat(amountEuros || '0'),
            })
            .eq('id', userId);
        }
      }

      // Create activity feed entry
      await supabase.from('activity_feed').insert({
        user_id: userId || null,
        username: 'Anónimo',
        event_type: 'CONTRIBUTION',
        message: `aportó ${amountEuros}€ y recibió ${pokeballs} Pokeballs`,
        metadata: {
          boxId,
          amount: amountEuros,
          pokeballs,
        },
      });

    } catch (error) {
      console.error('Error processing contribution:', error);
    }
  }
}
