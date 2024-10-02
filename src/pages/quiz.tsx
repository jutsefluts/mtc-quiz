import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Quiz from '../components/Quiz/Quiz'

const QuizPage: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <p className="medical-loading">Loading...</p>
  }

  if (!session) {
    router.push('/')
    return null
  }

  return <Quiz />
}

export default QuizPage
