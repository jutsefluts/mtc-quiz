import React from 'react'
import type { NextPage } from 'next'
import Quiz from '../components/Quiz/Quiz'

const Home: NextPage = () => {
  return (
    <div>
      <h1>My Quiz App</h1>
      <Quiz />
    </div>
  )
}

export default Home
