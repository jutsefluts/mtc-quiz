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
        <p className="medical-feedback">Welkom bij de MTC quiz!</p>
        <nav className="flex justify-center space-x-4 mt-8">
          <Link href="/auth/signin" className="auth-button auth-button-signin">
            Sign In
          </Link>
          <Link href="/auth/signup" className="auth-button auth-button-signup">
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
      <Quiz />
    </div>
  )
}

export default Home
