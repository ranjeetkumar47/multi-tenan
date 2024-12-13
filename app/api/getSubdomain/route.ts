import { NextResponse } from 'next/server'

const validNames = ['test', 'xotiv', 'anckr', 'test4']

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { subdomain } = body

    if (!subdomain) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!validNames.includes(subdomain)) {
      return NextResponse.json({ error: `Name "${subdomain}" is not valid` }, { status: 400 })
    }

    return NextResponse.json({ message: `Name is valid`, subdomain: subdomain }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json({ subdomains: validNames }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to fetch names' }, { status: 500 })
  }
}
