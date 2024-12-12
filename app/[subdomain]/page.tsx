'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function Component() {
  const params = useParams()
  const tenant = params.subdomain
  console.log(tenant)

  return <div className="flex flex-col min-h-screen">Hello I am {tenant}</div>
}
