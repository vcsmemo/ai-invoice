import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('[Webhook] Received request');

    const body = await request.text();
    const signature = headers().get('stripe-signature');

    console.log('[Webhook] Signature present:', !!signature);
    console.log('[Webhook] Body length:', body.length);

    if (!signature) {
      console.error('[Webhook] No signature provided');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    console.log('[Webhook] Webhook secret configured:', !!webhookSecret);

    if (!webhookSecret) {
      console.error('[Webhook] Webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      console.log('[Webhook] Attempting to verify signature...');
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
      console.log('[Webhook] Signature verified successfully');
    } catch (err) {
      console.error('[Webhook] Signature verification failed:', err);
      console.error('[Webhook] Error type:', (err as any).type);
      console.error('[Webhook] Error message:', (err as any).message);
      return NextResponse.json(
        { error: 'Invalid signature', details: (err as any).message },
        { status: 400 }
      );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      console.log('[Webhook] Processing checkout.session.completed');
      const session = event.data.object as Stripe.Checkout.Session;

      // Get metadata
      const userId = session.metadata?.userId;
      const credits = session.metadata?.credits;
      const packageId = session.metadata?.packageId;

      console.log('[Webhook] Metadata:', { userId, credits, packageId });

      if (!userId || !credits) {
        console.error('[Webhook] Missing metadata in webhook');
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
        console.error('[Webhook] User not found for credit update:', userId);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      console.log('[Webhook] Current credits:', user.credits_remaining);

      // Update user credits
      const { error } = await supabaseAdmin
        .from('users')
        .update({ credits_remaining: (user.credits_remaining || 0) + parseInt(credits) })
        .eq('id', userId);

      if (error) {
        console.error('[Webhook] Error updating user credits:', error);
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
        console.error('[Webhook] Error recording purchase:', purchaseError);
        // Don't fail the webhook if recording fails
      }

      console.log(`[Webhook] ✅ Successfully added ${credits} credits to user ${userId}`);
    } else {
      console.log('[Webhook] Received unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    console.error('[Webhook] Error stack:', (error as any)?.stack);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: (error as any)?.message },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhooks
export const dynamic = 'force-dynamic';
