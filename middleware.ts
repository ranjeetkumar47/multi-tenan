import { NextRequest, NextResponse } from 'next/server'

// Configuration for matching paths
export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)']
}

const baseUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN
// Export default function (Next.js expects this)
export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host') || ''

  // Allowed domains (local development and production domains)
  const allowedDomains = ['localhost:3001', 'ranjeet.dev']

  // Check if the current hostname is in the allowed domains
  const isAllowedDomain = allowedDomains.some((domain) => hostname.includes(domain))

  // Extract potential subdomain from the hostname
  const subdomain = hostname.split('.')[0]

  let subdomains: string[] = []
  try {
    const response = await fetch(`${baseUrl}/api/getSubdomain`, { method: 'GET' })
    if (response.ok) {
      const data = await response.json()
      subdomains = data.subdomains
    } else {
      console.error('Failed to fetch subdomains:', await response.text())
      return new Response('Internal Server Error', { status: 500 })
    }
  } catch (error) {
    console.error('Error fetching subdomains:', error)
    return new Response('Internal Server Error', { status: 500 })
  }

  // If the domain is allowed and the subdomain is not in the fetched list, proceed with the request
  if (isAllowedDomain && !subdomains.includes(subdomain)) {
    return NextResponse.next()
  }

  // If the subdomain exists in the fetched list, rewrite to a dynamic route
  if (subdomains.includes(subdomain)) {
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url))
  }

  // Return 404 if no matching subdomain is found
  return new Response('Not Found', { status: 404 })
}
