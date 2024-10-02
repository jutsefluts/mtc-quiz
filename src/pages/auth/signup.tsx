import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AuthLayout from '../../components/AuthLayout'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (response.ok) {
        router.push('/auth/signin')  // Redirect naar inlogpagina na succesvolle registratie
      } else {
        const data = await response.json()
        setError(data.message || 'Registratie mislukt')
      }
    } catch (error) {
      setError('Er is een fout opgetreden. Probeer het later opnieuw.')
    }
  }

  return (
    <AuthLayout>
      <h1 className="medical-title mb-6">Registreren</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Naam
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="medical-input"
          />
        </div>
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
          Registreren
        </button>
      </form>
      <p className="text-center text-gray-600 mt-4">
        Al een account?{' '}
        <Link href="/auth/signin" className="text-primary hover:underline">
          Log hier in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default SignUp
