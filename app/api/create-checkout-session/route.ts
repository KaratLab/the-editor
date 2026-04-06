export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PRICE_ID = 'price_1TIHnZ0udeCzK76qj41eIhOn'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://the-editor-seven.vercel.app'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://the-editor-seven.vercel.app'}/?canceled=true`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const stripeError = error as { message?: string; type?: string; code?: string }
    console.error('Stripe error message:', stripeError?.message)
    console.error('Stripe error type:', stripeError?.type)
    console.error('Stripe error code:', stripeError?.code)
    return NextResponse.json({ error: 'Failed to create checkout session', detail: stripeError?.message }, { status: 500 })
  }
}
