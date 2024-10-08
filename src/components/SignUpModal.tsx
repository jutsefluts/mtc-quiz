import React, { useState } from 'react'
import { signIn } from 'next-auth/react'

interface SignUpModalProps {
  onClose: () => void
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      if (response.ok) {
        // Sign in the user after successful registration
        await signIn('credentials', { email, password, callbackUrl: '/' })
      } else {
        const data = await response.json()
        setError(data.message || 'An error occurred during registration')
      }
    } catch (error) {
      setError('An error occurred during registration')
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Registreren</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
          />
          <button type="submit">Registreren</button>
        </form>
        <button onClick={onClose}>Sluiten</button>
      </div>
    </div>
  )
}

export default SignUpModal
