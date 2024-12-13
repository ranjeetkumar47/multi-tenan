'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Container from './ui/container'

const Header = () => {
  return (
    <div className="bg-gray-100 h-16 flex flex-row  items-center ">
      <Container>
        <div className="flex flex-row justify-between">
          <div className="text-3xl text-red-600 font-bold">Logo</div>
          <LoginComponent />
        </div>
      </Container>
    </div>
  )
}

export function LoginComponent() {
  const [organizationName, setOrganizationName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const body = { subdomain: organizationName.toLowerCase() }

    try {
      const response = await fetch('/api/getSubdomain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        const protocol = process.env.NEXT_PUBLIC_PROTOCOL || 'http' // Default to http if not set
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        window.location.href = `${protocol}://${organizationName}.${baseUrl}`
      } else {
        // If the subdomain is not valid, show the error message
        setError(data.error || 'An unknown error occurred')
      }
    } catch (error) {
      // Catch any errors that occur during the fetch
      setError('Failed to validate subdomain. Please try again later.')
    } finally {
      // Set loading state to false after the request finishes
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="font-bold">
          Login Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Your Organization</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <Label>Enter your organization name</Label>
          <Input value={organizationName} onChange={(e) => setOrganizationName(e.target.value.trim())} placeholder="Organization name" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Header
