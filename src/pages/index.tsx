import React from 'react'
import type { NextPage } from 'next'
import Quiz from '../components/Quiz/Quiz'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

const Home: NextPage = () => {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  if (loading) {
    return <div className="medical-container">
      <p className="medical-loading">Loading...</p>
    </div>
  }

  if (!session) {
    return (
      <div className="medical-container">
        <h1 className="medical-title">Medische Terminologie Quiz</h1>
        <p className="login-message">Log in om de quiz te spelen.</p>
        <nav className="flex justify-center space-x-4 mt-8">
          <Link href="/auth/signin" className="medical-button medical-button-neutral">
            Inloggen
          </Link>
          <Link href="/auth/signup" className="medical-button medical-button-neutral">
            Registreren
          </Link>
        </nav>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center shadow-sm" style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--background)'
      }}>
        <p className="text-lg font-semibold">
          Welkom, {session.user?.name || session.user?.email}!
        </p>
        <button 
          onClick={() => signOut()} 
          className="px-4 py-2 rounded transition-colors"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--primary)'
          }}
        >
          Uitloggen
        </button>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="medical-container relative">
          <Quiz />
        </div>
      </main>
    </div>
  )
}

export default Home
