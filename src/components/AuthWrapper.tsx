'use client';

import React from 'react'
import { useSession, signOut } from 'next-auth/react'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p className="medical-loading">Loading...</p>
  }

  return (
    <>
      <header className="medical-header">
        {session && (
          <div className="auth-container">
            <p className="user-greeting">Welkom, {session.user?.name || session.user?.email}</p>
            <button onClick={() => signOut()} className="medical-button auth-button">
              Uitloggen
            </button>
          </div>
        )}
      </header>
      <main className="medical-main">
        {children}
      </main>
    </>
  )
}

export default AuthWrapper
