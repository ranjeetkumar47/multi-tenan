import { NextRequest, NextResponse } from 'next/server'

// Configuration for matching paths
export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)']
}

const baseUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host') || ''

  const allowedDomains = ['localhost:3000', 'ranjeet.dev']

  const isAllowedDomain = allowedDomains.some((domain) => hostname.includes(domain))
  const subdomain = hostname.split('.')[0]

  let subdomains: string[] = []
  try {
    const response = await fetch(`${baseUrl}/api/getSubdomain`, { method: 'GET' })
    if (response.ok) {
      const data = await response.json()
      subdomains = data?.data.map((item: { subdomain: any }) => item.subdomain)
    } else {
      console.error('Failed to fetch subdomains:', await response.text())
      return new Response('Internal Server Error', { status: 500 })
    }
  } catch (error) {
    console.error('Error fetching subdomains:', error)
    return new Response('Internal Server Error', { status: 500 })
  }

  if (isAllowedDomain && !subdomains?.includes(subdomain)) {
    return NextResponse.next()
  }

  // If the subdomain exists in the fetched list, rewrite to a dynamic route
  if (subdomains.includes(subdomain)) {
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url))
  }

  // Return 404 if no matching subdomain is found
  return new Response('Not Found', { status: 404 })
}
