import Header from '@/components/Header'
import React, { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen">
      <Header />
      <div className="px-20 py-2">{children}</div>
    </div>
  )
}

export default RootLayout
