import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Quiz from '../components/Quiz/Quiz'
import AuthLayout from '../components/AuthLayout/AuthLayout'

const QuizPage: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <AuthLayout>
      <p className="medical-loading">Loading...</p>
    </AuthLayout>
  }

  if (!session) {
    router.push('/')
    return null
  }

  return (
    <AuthLayout>
      <Quiz />
    </AuthLayout>
  )
}

export default QuizPage
