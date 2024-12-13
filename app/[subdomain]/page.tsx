'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type SubdomainData = {
  ownerName: string
  htmlTemplate: string
}

export default function Component() {
  const params = useParams()
  const tenant = params.subdomain
  const [data, setData] = useState<SubdomainData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        const response = await fetch(`/api/getSubdomain?subdomain=${tenant}`)
        const result = await response.json()
        console.log('res', result)
        setData(result.data)
      } catch (error) {
        console.error('Error fetching HTML content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHtmlContent()
  }, [tenant])

  if (loading) {
    return <div className="flex flex-col min-h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <h1>Hi {data?.ownerName}</h1>
      <div dangerouslySetInnerHTML={{ __html: data?.htmlTemplate ?? '' }} />
    </div>
  )
}
