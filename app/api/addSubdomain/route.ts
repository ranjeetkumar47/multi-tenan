import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let body: { subdomain: string; ownerName: string; htmlTemplate: string }
  try {
    body = await req.json()
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { subdomain, ownerName, htmlTemplate } = body

  if (!subdomain) {
    return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('subdomain')
    .insert([
      {
        subdomain,
        ownerName,
        htmlTemplate
      }
    ])
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Subdomain already exists' }, { status: 409 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data }, { status: 201 })
}
