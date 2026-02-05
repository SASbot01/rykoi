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

    // Retrieve the session from Stripe
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const { userId, pokeballs, boxId, crowdfundAmount, amountEuros } = session.metadata || {};
    const supabase = getSupabase();

    // Check if this session has already been processed
    const { data: existingContribution } = await supabase
      .from('contributions')
      .select('id')
      .eq('stripe_payment_intent_id', session.payment_intent)
      .single();

    if (existingContribution) {
      // Already processed, just return success
      return NextResponse.json({
        success: true,
        message: 'Already processed',
        pokeballs: parseInt(pokeballs || '0')
      });
    }

    // Create contribution record
    const { error: contributionError } = await supabase
      .from('contributions')
      .insert({
        user_id: userId || null,
        box_id: boxId || null,
        euros_paid: parseFloat(amountEuros || '0'),
        euros_to_box: parseFloat(crowdfundAmount || '0'),
        pokeballs_given: parseInt(pokeballs || '0'),
        stripe_payment_intent_id: session.payment_intent as string,
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
      });

    if (contributionError) {
      console.error('Contribution error:', contributionError);
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
            current_raised: (box.current_raised || 0) + parseFloat(crowdfundAmount || '0'),
            contributors_count: (box.contributors_count || 0) + 1,
          })
          .eq('id', boxId);
      }
    }

    // Update user pokeballs if userId exists
    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('pokeballs, total_contributed')
        .eq('id', userId)
        .single();

      if (user) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            pokeballs: (user.pokeballs || 0) + parseInt(pokeballs || '0'),
            total_contributed: (user.total_contributed || 0) + parseFloat(amountEuros || '0'),
          })
          .eq('id', userId);

        if (updateError) {
          console.error('User update error:', updateError);
        }
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
      pokeballs: parseInt(pokeballs || '0'),
      message: 'Payment verified and pokeballs added'
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
