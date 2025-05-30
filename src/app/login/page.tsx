'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, FirebaseError } from '@lib/firebase/config'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaChild, FaExclamationTriangle } from 'react-icons/fa'

export default function LoginPage() {
  const [email, setEmail] = useState('info@unamifoundation.org')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const router = useRouter()

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isOnline) {
      setError('You are offline. Please check your internet connection.')
      return
    }
    
    setError('')
    setIsLoading(true)
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      
      // Set session cookie
      document.cookie = `session=${token}; path=/; secure; sameSite=lax`
      
      router.push('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      const firebaseError = err as FirebaseError
      
      // Handle specific Firebase errors
      switch (firebaseError.code) {
        case 'auth/invalid-email':
          setError('Invalid email address')
          break
        case 'auth/user-disabled':
          setError('This account has been disabled')
          break
        case 'auth/user-not-found':
          setError('No account found with this email')
          break
        case 'auth/wrong-password':
          setError('Incorrect password')
          break
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection and try again.')
          break
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.')
          break
        default:
          setError('Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '400px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #1a365d, #2c5282)',
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center',
          position: 'relative'
        }}>
          {!isOnline && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              backgroundColor: 'rgba(229, 62, 62, 0.9)',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}>
              <FaExclamationTriangle style={{ marginRight: '8px' }} />
              You are currently offline
            </div>
          )}
          
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <FaChild style={{ color: '#1a365d', fontSize: '40px' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '5px' }}>NCIP Login</h1>
          <p style={{ fontSize: '14px', opacity: '0.9' }}>National Child Identification Program</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleLogin} style={{ padding: '30px' }}>
          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '12px',
              backgroundColor: '#FFF5F5',
              color: '#E53E3E',
              borderRadius: '12px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaExclamationTriangle style={{ marginRight: '8px' }} />
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              color: '#4A5568',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#718096',
                fontSize: '18px'
              }} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: '#F8FAFC',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                placeholder="Enter your email"
                required
                disabled={!isOnline}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              color: '#4A5568',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#718096',
                fontSize: '18px'
              }} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 48px 16px 48px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: '#F8FAFC',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                placeholder="Enter your password"
                required
                disabled={!isOnline}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#718096',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                onClick={() => setShowPassword(!showPassword)}
                disabled={!isOnline}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(to right, #1a365d, #2c5282)',
              color: 'white',
              fontWeight: '600',
              borderRadius: '12px',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 10px rgba(26, 54, 93, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isOnline ? 1 : 0.7
            }}
            disabled={isLoading || !isOnline}
          >
            {isLoading ? (
              <>
                <svg 
                  style={{ 
                    animation: 'spin 1s linear infinite',
                    marginRight: '12px',
                    height: '20px',
                    width: '20px'
                  }} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    style={{ opacity: '0.25' }} 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    style={{ opacity: '0.75' }} 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : isOnline ? (
              "Login"
            ) : (
              "Offline - Cannot Login"
            )}
          </button>
          
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          
          <div style={{ marginTop: '24px', textAlign: 'center', color: '#718096' }}>
            <a href="#" style={{
              color: '#4299e1',
              fontWeight: '500',
              textDecoration: 'none'
            }}>
              Forgot password?
            </a>
            <p style={{ marginTop: '12px' }}>
              Don&apos;t have an account?{' '}
              <a href="#" style={{
                color: '#4299e1',
                fontWeight: '500',
                textDecoration: 'none'
              }}>
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
