import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subdomain = searchParams.get('subdomain')

  if (subdomain) {
    const { data, error } = await supabase.from('subdomain').select('*').eq('subdomain', subdomain).single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Subdomain not found' }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } else {
    const { data, error } = await supabase.from('subdomain').select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  }
}
