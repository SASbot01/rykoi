import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-01-28.clover',
    });
  }
  return stripeInstance;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const stripe = getStripe();
    const supabase = getSupabase();

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('Session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      metadata: session.metadata,
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const { userId, pokeballs, boxId, crowdfundAmount, amountEuros } = session.metadata || {};
    const pokeballsNum = parseInt(pokeballs || '0');
    const amountNum = parseFloat(amountEuros || '0');
    const crowdfundNum = parseFloat(crowdfundAmount || '0');

    // Check if this session has already been processed
    const { data: existingContribution } = await supabase
      .from('contributions')
      .select('id')
      .eq('stripe_payment_intent_id', session.payment_intent as string)
      .maybeSingle();

    if (existingContribution) {
      console.log('Already processed, returning success');
      return NextResponse.json({
        success: true,
        message: 'Already processed',
        pokeballs: pokeballsNum
      });
    }

    // Update user pokeballs if userId exists
    if (userId) {
      console.log('Updating user:', userId);

      // Get current user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('pokeballs, total_contributed')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('User fetch error:', userError);
      }

      if (userData) {
        const newPokeballs = (userData.pokeballs || 0) + pokeballsNum;
        const newContributed = (userData.total_contributed || 0) + amountNum;

        console.log('Updating pokeballs:', {
          current: userData.pokeballs,
          adding: pokeballsNum,
          new: newPokeballs,
        });

        const { error: updateError } = await supabase
          .from('users')
          .update({
            pokeballs: newPokeballs,
            total_contributed: newContributed,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('User update error:', updateError);
        } else {
          console.log('User updated successfully');
        }
      }
    }

    // Create contribution record (allow null user_id)
    const { error: contributionError } = await supabase
      .from('contributions')
      .insert({
        user_id: userId || null,
        box_id: boxId || null,
        euros_paid: amountNum,
        euros_to_box: crowdfundNum,
        pokeballs_given: pokeballsNum,
        stripe_payment_intent_id: session.payment_intent as string,
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
      });

    if (contributionError) {
      console.error('Contribution insert error:', contributionError);
    }

    // Update box if boxId exists
    if (boxId) {
      const { data: box } = await supabase
        .from('boxes')
        .select('current_raised, contributors_count')
        .eq('id', boxId)
        .single();

      if (box) {
        await supabase
          .from('boxes')
          .update({
            current_raised: (box.current_raised || 0) + crowdfundNum,
            contributors_count: (box.contributors_count || 0) + 1,
          })
          .eq('id', boxId);
      }
    }

    // Create activity feed entry
    await supabase.from('activity_feed').insert({
      user_id: userId || null,
      username: 'Usuario',
      event_type: 'contribution',
      message: `aportó ${amountEuros}€ y recibió ${pokeballs} Pokeballs`,
      metadata: { boxId, amount: amountEuros, pokeballs },
    });

    return NextResponse.json({
      success: true,
      pokeballs: pokeballsNum,
      message: 'Payment verified and pokeballs added'
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({
      error: 'Verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
