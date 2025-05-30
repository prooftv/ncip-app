'use client'

import { useAuth } from '@features/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FaChild, FaBell, FaMapMarkerAlt, FaShieldAlt, FaPlus, FaUser } from 'react-icons/fa'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '16px', fontSize: '18px' }}>Loading your dashboard...</p>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(to right, #1a365d, #2c5282)',
        color: 'white',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: '10px',
              marginRight: '15px'
            }}>
              <FaChild style={{ color: '#1a365d', fontSize: '28px' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '600' }}>NCIP Dashboard</h1>
          </div>
          <button style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            padding: '10px',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer'
          }}>
            <FaBell style={{ fontSize: '20px', color: 'white' }} />
          </button>
        </div>
      </header>

      {/* Welcome Banner */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <FaUser style={{ 
              fontSize: '20px', 
              color: '#4A5568',
              marginRight: '12px'
            }} />
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: '700',
              color: '#2D3748'
            }}>
              Welcome back, {user.email?.split('@')[0]}
            </h2>
          </div>
          <p style={{ 
            color: '#718096',
            fontSize: '16px',
            marginLeft: '32px'
          }}>
            Protecting children, empowering communities
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '24px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2D3748',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '2px solid #E2E8F0'
          }}>
            Quick Actions
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }}>
            {/* Add Child */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: '#EBF8FF',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <FaChild style={{ fontSize: '28px', color: '#3182CE' }} />
              </div>
              <h4 style={{
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                Add Child
              </h4>
              <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#718096'
              }}>
                Register a new child profile
              </p>
            </div>
            
            {/* Safe Zones */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: '#F0FFF4',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <FaMapMarkerAlt style={{ fontSize: '28px', color: '#38A169' }} />
              </div>
              <h4 style={{
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                Safe Zones
              </h4>
              <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#718096'
              }}>
                Set up geofenced areas
              </p>
            </div>
            
            {/* Alerts */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: '#FFFAF0',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <FaBell style={{ fontSize: '28px', color: '#DD6B20' }} />
              </div>
              <h4 style={{
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                Alerts
              </h4>
              <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#718096'
              }}>
                View recent notifications
              </p>
            </div>
            
            {/* Security */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: '#FAF5FF',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <FaShieldAlt style={{ fontSize: '28px', color: '#9F7AEA' }} />
              </div>
              <h4 style={{
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                Security
              </h4>
              <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#718096'
              }}>
                Manage account settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Children Section */}
      <div style={{ padding: '24px 20px', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2D3748',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '2px solid #E2E8F0'
          }}>
            Your Children
          </h3>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
          }}>
            {/* Child 1 */}
            <div style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #EDF2F7'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#EBF8FF',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <FaChild style={{ fontSize: '28px', color: '#3182CE' }} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2D3748',
                  marginBottom: '4px'
                }}>
                  Sarah Johnson
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#718096'
                }}>
                  Age 8 • Last seen: School
                </p>
              </div>
            </div>
            
            {/* Child 2 */}
            <div style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #EDF2F7'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#EBF8FF',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <FaChild style={{ fontSize: '28px', color: '#3182CE' }} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2D3748',
                  marginBottom: '4px'
                }}>
                  Michael Johnson
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#718096'
                }}>
                  Age 5 • Last seen: Home
                </p>
              </div>
            </div>
            
            {/* Add Child Button */}
            <div style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC'
            }}>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: '#3182CE',
                fontWeight: '600',
                fontSize: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}>
                <FaPlus style={{ marginRight: '8px' }} />
                Add another child
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Section */}
      <div style={{ padding: '24px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2D3748',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '2px solid #E2E8F0'
          }}>
            Emergency Actions
          </h3>
          
          <div style={{
            background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <h4 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              Report Missing Child
            </h4>
            <p style={{
              fontSize: '16px',
              marginBottom: '24px',
              opacity: '0.9'
            }}>
              Immediately alert authorities and community members
            </p>
            <button style={{
              backgroundColor: 'white',
              color: '#E53E3E',
              fontWeight: '700',
              fontSize: '16px',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
            }}>
              Activate Emergency Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
