import styles from './dashboard.module.css';
'use client'

import { useAuth } from '@features/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FaChild, FaBell, FaMapMarkerAlt, FaShieldAlt, FaPlus, FaUser } from 'react-icons/fa'

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
      <div className={styles.emergencyButton} style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div className={styles.emergencyButton} style={{ textAlign: 'center', color: 'white' }}>
          <div className={styles.emergencyButton} style={{
            width: '64px',
            height: '64px',
            border: '4px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p className={styles.emergencyButton} style={{ marginTop: '16px', fontSize: '18px' }}>Loading your dashboard...</p>
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
    <div className={styles.emergencyButton} style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Header */}
      <header className={styles.emergencyButton} style={{
        background: 'linear-gradient(to right, #1a365d, #2c5282)',
        color: 'white',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div className={styles.emergencyButton} style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div className={styles.emergencyButton} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={styles.emergencyButton} style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: '10px',
              marginRight: '15px'
            }}>
              <FaChild className={styles.emergencyButton} style={{ color: '#1a365d', fontSize: '28px' }} />
            </div>
            <h1 className={styles.emergencyButton} style={{ fontSize: '24px', fontWeight: '600' }}>NCIP Dashboard</h1>
          </div>
          <button className={styles.emergencyButton} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            padding: '10px',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            className={styles.quickActionCard}
          }}>
            <FaBell className={styles.emergencyButton} style={{ fontSize: '20px', color: 'white' }} />
          </button>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className={styles.emergencyButton} style={{
        backgroundColor: 'white',
        padding: '24px 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div className={styles.emergencyButton} style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className={styles.emergencyButton} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <FaUser className={styles.emergencyButton} style={{ 
              fontSize: '20px', 
              color: '#4A5568',
              marginRight: '12px'
            }} />
            <h2 className={styles.emergencyButton} style={{ 
              fontSize: '22px', 
              fontWeight: '700',
              color: '#2D3748'
            }}>
              Welcome back, {user.email?.split('@')[0]}
            </h2>
          </div>
          <p className={styles.emergencyButton} style={{ 
            color: '#718096',
            fontSize: '16px',
            marginLeft: '32px'
          }}>
            Protecting children, empowering communities
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.emergencyButton} style={{ padding: '24px 20px' }}>
        <div className={styles.emergencyButton} style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 className={styles.emergencyButton} style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2D3748',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '2px solid #E2E8F0'
          }}>
            Quick Actions
          </h3>
          
          <div className={styles.emergencyButton} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }}>
            {/* Add Child */}
            <div className={styles.emergencyButton} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              className={styles.quickActionCard}
            }}>
              <div className={styles.emergencyButton} style={{
                backgroundColor: '#EBF8FF',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <FaChild className={styles.emergencyButton} style={{ fontSize: '28px', color: '#3182CE' }} />
              </div>
              <h4 className={styles.emergencyButton} style={{
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                Add Child
              </h4>
              <p className={styles.emergencyButton} style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#718096'
              }}>
                Register a new child profile
              </p>
            </div>
            
            {/* Safe Zones */}
            <div className={styles.emergencyButton} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              className={styles.quickActionCard}
            }}>
              <div className={styles.emergencyButton} style={{
                backgroundColor: '#F0FFF4',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <FaMapMarkerAlt className={styles.emergencyButton} style={{ fontSize: '28px', color: '#38A169' }} />
              </div>
              <h4 className={styles.emergencyButton} style={{
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                Safe Zones
              </h4>
              <p className={styles.emergencyButton} style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#718096'
              }}>
                Set up geofenced areas
              </p>
            </div>
            
            {/* Alerts */}
            <div className={styles.emergencyButton} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              className={styles.quickActionCard}
            }}>
              <div className={styles.emergencyButton} style={{
                backgroundColor: '#FFFAF0',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <FaBell className={styles.emergencyButton} style={{ fontSize: '28px', color: '#DD6B20' }} />
              </div>
              <h4 className={styles.emergencyButton} style={{
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                Alerts
              </h4>
              <p className={styles.emergencyButton} style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#718096'
              }}>
                View recent notifications
              </p>
            </div>
            
            {/* Security */}
            <div className={styles.emergencyButton} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              className={styles.quickActionCard}
            }}>
              <div className={styles.emergencyButton} style={{
                backgroundColor: '#FAF5FF',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <FaShieldAlt className={styles.emergencyButton} style={{ fontSize: '28px', color: '#9F7AEA' }} />
              </div>
              <h4 className={styles.emergencyButton} style={{
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#2D3748',
                marginBottom: '8px'
              }}>
                Security
              </h4>
              <p className={styles.emergencyButton} style={{
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
      <div className={styles.emergencyButton} style={{ padding: '24px 20px', backgroundColor: '#F8FAFC' }}>
        <div className={styles.emergencyButton} style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 className={styles.emergencyButton} style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2D3748',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '2px solid #E2E8F0'
          }}>
            Your Children
          </h3>
          
          <div className={styles.emergencyButton} style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
          }}>
            {/* Child 1 */}
            <div className={styles.emergencyButton} style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #EDF2F7'
            }}>
              <div className={styles.emergencyButton} style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#EBF8FF',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <FaChild className={styles.emergencyButton} style={{ fontSize: '28px', color: '#3182CE' }} />
              </div>
              <div>
                <h4 className={styles.emergencyButton} style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2D3748',
                  marginBottom: '4px'
                }}>
                  Sarah Johnson
                </h4>
                <p className={styles.emergencyButton} style={{
                  fontSize: '14px',
                  color: '#718096'
                }}>
                  Age 8 • Last seen: School
                </p>
              </div>
            </div>
            
            {/* Child 2 */}
            <div className={styles.emergencyButton} style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #EDF2F7'
            }}>
              <div className={styles.emergencyButton} style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#EBF8FF',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <FaChild className={styles.emergencyButton} style={{ fontSize: '28px', color: '#3182CE' }} />
              </div>
              <div>
                <h4 className={styles.emergencyButton} style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2D3748',
                  marginBottom: '4px'
                }}>
                  Michael Johnson
                </h4>
                <p className={styles.emergencyButton} style={{
                  fontSize: '14px',
                  color: '#718096'
                }}>
                  Age 5 • Last seen: Home
                </p>
              </div>
            </div>
            
            {/* Add Child Button */}
            <div className={styles.emergencyButton} style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC'
            }}>
              <button className={styles.emergencyButton} style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: '#3182CE',
                fontWeight: '600',
                fontSize: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                className={styles.quickActionCard}
              }}>
                <FaPlus className={styles.emergencyButton} style={{ marginRight: '8px' }} />
                Add another child
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Section */}
      <div className={styles.emergencyButton} style={{ padding: '24px 20px' }}>
        <div className={styles.emergencyButton} style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 className={styles.emergencyButton} style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2D3748',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '2px solid #E2E8F0'
          }}>
            Emergency Actions
          </h3>
          
          <div className={styles.emergencyButton} style={{
            background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <h4 className={styles.emergencyButton} style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              Report Missing Child
            </h4>
            <p className={styles.emergencyButton} style={{
              fontSize: '16px',
              marginBottom: '24px',
              opacity: '0.9'
            }}>
              Immediately alert authorities and community members
            </p>
            <button className={styles.emergencyButton} style={{
              backgroundColor: 'white',
              color: '#E53E3E',
              fontWeight: '700',
              fontSize: '16px',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              className={styles.quickActionCard},
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
