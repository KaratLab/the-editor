import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function DELETE(request: NextRequest) {
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

    const { evaluationId, imageUrl } = await request.json()
    if (!evaluationId) {
      return NextResponse.json({ error: 'evaluationId is required' }, { status: 400 })
    }

    // Verify ownership before deleting
    const { data: evaluation, error: fetchError } = await supabase
      .from('evaluations')
      .select('id, user_id, image_url')
      .eq('id', evaluationId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !evaluation) {
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 })
    }

    // Delete image from Supabase Storage if exists
    if (imageUrl) {
      try {
        // Extract storage path from public URL
        // URL format: https://xxx.supabase.co/storage/v1/object/public/outfit-images/{path}
        const storagePrefix = '/storage/v1/object/public/outfit-images/'
        const urlObj = new URL(imageUrl)
        const pathIndex = urlObj.pathname.indexOf(storagePrefix)
        if (pathIndex !== -1) {
          const storagePath = urlObj.pathname.slice(pathIndex + storagePrefix.length)
          await supabase.storage.from('outfit-images').remove([storagePath])
        }
      } catch {
        // Storage deletion failure should not block DB deletion
      }
    }

    // Delete evaluation record from DB
    const { error: deleteError } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', evaluationId)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete evaluation' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete evaluation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
