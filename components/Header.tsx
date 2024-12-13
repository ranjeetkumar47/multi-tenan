'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Container from './ui/container'

const Header = () => {
  return (
    <div className="bg-gray-100 h-16 flex flex-row items-center">
      <Container>
        <div className="flex flex-row justify-between">
          <div className="text-3xl text-red-600 font-bold">Logo</div>
          <div className="flex space-x-4">
            <LoginComponent />
            <SignUpComponent />
          </div>
        </div>
      </Container>
    </div>
  )
}

export function LoginComponent() {
  const [organizationName, setOrganizationName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/getSubdomain?subdomain=${organizationName.toLowerCase()}`, {
        method: 'GET'
      })

      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok && data) {
        const protocol = process.env.NEXT_PUBLIC_PROTOCOL || 'http'
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

        if (!baseUrl) {
          throw new Error('Base URL is not defined in the environment variables')
        }

        window.location.href = `${protocol}://${organizationName}.${baseUrl}`
      } else {
        setError(data.error || 'An unknown error occurred')
      }
    } catch (err) {
      console.error('Error during subdomain validation:', err)
      setError('Failed to validate subdomain. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-bold">
          Login Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Your Organization</DialogTitle>
          <DialogDescription>Enter your organization's subdomain to proceed.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <Label htmlFor="organizationName">Organization Subdomain</Label>
          <Input
            id="organizationName"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value.trim())}
            placeholder="e.g., mayank"
            required
          />
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

export function SignUpComponent() {
  const [subdomain, setSubdomain] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [htmlTemplate, setHtmlTemplate] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Basic validation
    if (!subdomain || !ownerName) {
      setError('Subdomain and Owner Name are required.')
      setLoading(false)
      return
    }

    // Optional: Add more validation for subdomain format
    const subdomainRegex = /^[a-z0-9-]{3,30}$/
    if (!subdomainRegex.test(subdomain)) {
      setError('Subdomain must be 3-30 characters long and can only include lowercase letters, numbers, and hyphens.')
      setLoading(false)
      return
    }

    const body = {
      subdomain: subdomain.toLowerCase(),
      ownerName: ownerName.trim(),
      htmlTemplate: htmlTemplate.trim() || null
    }

    try {
      const response = await fetch('/api/addSubdomain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Organization created successfully! Redirecting...')
        // Optionally, redirect the user after a short delay
        setTimeout(() => {
          const protocol = process.env.NEXT_PUBLIC_PROTOCOL || 'http'
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
          window.location.href = `${protocol}://${subdomain}.${baseUrl}`
        }, 2000)
      } else {
        setError(data.error || 'An unknown error occurred')
      }
    } catch (error) {
      setError('Failed to create organization. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="font-bold">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Your Organization</DialogTitle>
          <DialogDescription>Provide the necessary details to set up your organization's subdomain.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="subdomain">Subdomain</Label>
            <Input id="subdomain" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} placeholder="e.g., mayank" required />
          </div>
          <div>
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g., Mayank Ghildiyal" required />
          </div>
          <div>
            <Label htmlFor="htmlTemplate">HTML Template (Optional)</Label>
            <Textarea
              id="htmlTemplate"
              value={htmlTemplate}
              onChange={(e) => setHtmlTemplate(e.target.value)}
              placeholder="Enter custom HTML template if any."
              rows={4}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Header
