import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get metadata
      const userId = session.metadata?.userId;
      const credits = session.metadata?.credits;
      const packageId = session.metadata?.packageId;

      if (!userId || !credits) {
        console.error('Missing metadata in webhook');
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      // Fetch current credits
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('credits_remaining')
        .eq('id', userId)
        .single();

      if (!user) {
        console.error('User not found for credit update');
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update user credits
      const { error } = await supabaseAdmin
        .from('users')
        .update({ credits_remaining: (user.credits_remaining || 0) + parseInt(credits) })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user credits:', error);
        return NextResponse.json(
          { error: 'Failed to update credits' },
          { status: 500 }
        );
      }

      // Record credit purchase
      const { error: purchaseError } = await supabaseAdmin
        .from('credit_purchases')
        .insert({
          user_id: userId,
          credits: parseInt(credits),
          amount: (session.amount_total || 0) / 100,
          stripe_payment_intent_id: session.payment_intent as string,
          status: 'completed',
        });

      if (purchaseError) {
        console.error('Error recording purchase:', purchaseError);
        // Don't fail the webhook if recording fails
      }

      console.log(`Successfully added ${credits} credits to user ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhooks
export const dynamic = 'force-dynamic';
