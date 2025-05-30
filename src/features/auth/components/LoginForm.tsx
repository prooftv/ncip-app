'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@features/auth/api/authService';
import { useAuth } from '@features/auth/context';
import Link from 'next/link';
import { FaChild, FaExclamationTriangle } from 'react-icons/fa';
import styles from '@app/login/login.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await login(email, password);
      setUser(user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Account disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your connection';
          break;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <FaChild className={styles.logoIcon} />
            NCIP Login
          </h1>
        </div>
        
        <div className={styles.content}>
          {error && (
            <div className={styles.error}>
              <FaExclamationTriangle className={styles.errorIcon} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className={styles.footer}>
            <Link href="/register" className={styles.link}>
              Don't have an account? Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
