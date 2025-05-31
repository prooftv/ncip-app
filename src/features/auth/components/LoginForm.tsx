'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@features/auth/api/authService';
import { useAuth } from '@features/auth/context';
import Link from 'next/link';
import { FaChild, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import styles from '@app/login/login.module.css';

export default function LoginForm() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <FaChild className={styles.logoIcon} />
            Child Safety Platform
          </h1>
        </div>
        
        <div className={styles.content}>
          <h2 className={styles.subtitle}>Sign in to your account</h2>
          
          {error && (
            <div className={styles.error}>
              <FaExclamationTriangle className={styles.errorIcon} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className={styles.button}
            >
              {isLoggingIn ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className={styles.footer}>
            <Link href="/forgot-password" className={styles.link}>Forgot password?</Link>
            <span> | </span>
            <Link href="/register" className={styles.link}>Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
