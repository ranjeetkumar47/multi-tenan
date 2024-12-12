import { NextRequest, NextResponse } from 'next/server'

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

  // Fetch subdomains dynamically from the API
  let subdomains: { subdomain: string }[] = []
  try {
    const response = await fetch('http://localhost:3000/api/getSubdomain') // Update with the actual API URL
    if (response.ok) {
      const data = await response.json()
      subdomains = data.names.map((name: string) => ({ subdomain: name }))
    }
  } catch (error) {
    console.error('Failed to fetch subdomains:', error)
    return new Response('Internal Server Error', { status: 500 })
  }

  // If the domain is allowed and there is no subdomain, proceed with the request
  if (isAllowedDomain && !subdomains.some((d) => d.subdomain === subdomain)) {
    return NextResponse.next()
  }

  // Find subdomain data in the fetched subdomains list
  const subdomainData = subdomains.find((d) => d.subdomain === subdomain)

  if (subdomainData) {
    // Rewrite the URL to a dynamic route based on the subdomain
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url))
  }

  // Return 404 if no matching subdomain is found
  return new Response('Not Found', { status: 404 })
}
