import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Header = () => {
  return (
    <div className="bg-primary h-16 flex flex-row justify-between items-center px-20">
      <div className="text-3xl text-white font-bold">Logo</div>
      <LoginCompoent />
    </div>
  )
}

export function LoginCompoent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Login Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Your Organization</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3">
          <Label>Enter your organization name</Label>
          <Input />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Header
