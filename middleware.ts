import { NextRequest, NextResponse } from 'next/server'

// Import subdomains list (this can be a JSON file or fetched from a database)
import subdomains from './subdomains.json'

// Configuration for matching paths
export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)']
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host') || ''

  // Allowed domains (local development and production domains)
  const allowedDomains = ['localhost:3001', 'ranjeet.dev']

  // Check if the current hostname is in the allowed domains
  const isAllowedDomain = allowedDomains.some((domain) => hostname.includes(domain))

  // Extract potential subdomain from the hostname
  const subdomain = hostname.split('.')[0]

  // If the domain is allowed and there is no subdomain, proceed with the request
  if (isAllowedDomain && !subdomains.some((d) => d.subdomain === subdomain)) {
    return NextResponse.next()
  }

  // Find subdomain data in the subdomains list
  const subdomainData = subdomains.find((d) => d.subdomain === subdomain)

  if (subdomainData) {
    // Rewrite the URL to a dynamic route based on the subdomain
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url))
  }

  // Return 404 if no matching subdomain is found
  return new Response('Not Found', { status: 404 })
}
