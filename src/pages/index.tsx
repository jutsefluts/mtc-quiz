import React from 'react'
import type { NextPage } from 'next'
import Quiz from '@/components/Quiz'

const Home: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Quiz App</h1>
      <Quiz />
    </div>
  )
}

export default Home
