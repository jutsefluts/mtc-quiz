import React from 'react'

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
