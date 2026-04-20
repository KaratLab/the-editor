export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check premium status + subscription ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, stripe_subscription_id')
      .eq('id', user.id)
      .single()

    const isPremium = profile?.is_premium ?? false

    // Count evaluations this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count, error } = await supabase
      .from('evaluations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString())

    if (error) throw error

    // If premium, fetch Stripe subscription to check cancel status
    let cancelAtPeriodEnd = false
    let subscriptionEndDate: string | null = null

    if (isPremium && profile?.stripe_subscription_id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          profile.stripe_subscription_id
        )
        cancelAtPeriodEnd = subscription.cancel_at_period_end
        if (cancelAtPeriodEnd && subscription.current_period_end) {
          // Convert Unix timestamp to ISO date string
          subscriptionEndDate = new Date(
            subscription.current_period_end * 1000
          ).toISOString()
        }
      } catch {
        // Stripe error should not block the response
      }
    }

    return NextResponse.json({
      count: count ?? 0,
      isPremium,
      cancelAtPeriodEnd,
      subscriptionEndDate,
    })
  } catch (error) {
    console.error('Usage check error:', error)
    return NextResponse.json({ count: 0 })
  }
}
