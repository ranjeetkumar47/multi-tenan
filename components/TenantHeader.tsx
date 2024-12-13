import React from 'react'
import Container from './ui/container'

const TenantHeader = () => {
  return (
    <div className="bg-gray-100 h-16 flex flex-row justify-between items-center">
      <Container>
        <div className="text-3xl text-red-600 font-bold">Hi Welcome to tenant page</div>
      </Container>
    </div>
  )
}

export default TenantHeader
