'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LoginProps {
  isRegistering: boolean;
  setIsRegistering: (isRegistering: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ isRegistering, setIsRegistering }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        // Handle registration
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          // If registration is successful, proceed to sign in
          await signIn('credentials', { email, password, redirect: false });
          router.push('/');
        } else {
          const data = await response.json();
          setError(data.message || 'An error occurred during registration');
        }
      } else {
        // Handle login
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred');
    }
  };

  return (
    <div className="login-form">
      <h2 className="medical-subtitle">{isRegistering ? 'Registreren' : 'Inloggen'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Wachtwoord</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="medical-button auth-button">
          {isRegistering ? 'Registreren' : 'Inloggen'}
        </button>
      </form>
      <p className="auth-switch">
        {isRegistering ? 'Al een account?' : 'Nog geen account?'}
        <button onClick={() => setIsRegistering(!isRegistering)} className="auth-switch-button">
          {isRegistering ? 'Inloggen' : 'Registreren'}
        </button>
      </p>
    </div>
  );
};

export default Login;
