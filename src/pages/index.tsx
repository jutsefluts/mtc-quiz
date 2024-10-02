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
        <h1 className="medical-title">Welcome to My Quiz App</h1>
        <p className="medical-feedback">Please sign in to play the quiz.</p>
        <nav className="flex justify-center space-x-4 mt-8">
          <Link href="/auth/signin" className="medical-button medical-button-neutral">
            Sign In
          </Link>
          <Link href="/auth/signup" className="medical-button medical-button-neutral">
            Sign Up
          </Link>
        </nav>
      </div>
    )
  }

  return (
    <div className="medical-container relative">
      <button onClick={() => signOut()} className="medical-button medical-button-neutral medical-logout-button">
        Uitloggen
      </button>
      <h1 className="medical-title">Welkom bij Mijn Quiz App</h1>
      <p className="medical-feedback">Hallo, {session?.user?.name || session?.user?.email}!</p>
      <Quiz />
    </div>
  )
}

export default Home
