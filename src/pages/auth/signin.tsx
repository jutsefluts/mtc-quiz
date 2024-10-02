import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AuthLayout from '../../components/AuthLayout'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError('Inloggen mislukt. Controleer je e-mail en wachtwoord.')
    } else {
      router.push('/')  // Redirect naar de homepage na succesvol inloggen
    }
  }

  return (
    <AuthLayout>
      <h1 className="medical-title mb-6">Inloggen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="medical-input"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Wachtwoord
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="medical-input"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="medical-button w-full">
          Inloggen
        </button>
      </form>
      <p className="text-center text-gray-600 mt-4">
        Nog geen account?{' '}
        <Link href="/auth/signup" className="text-primary hover:underline">
          Registreer hier
        </Link>
      </p>
    </AuthLayout>
  )
}

export default SignIn
