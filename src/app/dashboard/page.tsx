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
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <FaChild className={styles.logoChildIcon} />
            </div>
            <h1 className={styles.title}>NCIP Dashboard</h1>
          </div>
          <button className={styles.notificationButton}>
            <FaBell className={styles.bellIcon} />
          </button>
        </div>
      </header>

      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeHeader}>
            <FaUser className={styles.userIcon} />
            <h2 className={styles.welcomeTitle}>Welcome back, {user.email?.split('@')[0]}</h2>
          </div>
          <p className={styles.welcomeSubtitle}>Protecting children, empowering communities</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionContent}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          
          <div className={styles.actionsGrid}>
            <div className={`${styles.quickActionCard} ${styles.actionCard}`}>
              <div className={styles.actionIconBlue}>
                <FaChild className={styles.actionIcon} />
              </div>
              <h4 className={styles.actionTitle}>Add Child</h4>
              <p className={styles.actionDescription}>Register a new child profile</p>
            </div>
            
            <div className={`${styles.quickActionCard} ${styles.actionCard}`}>
              <div className={styles.actionIconGreen}>
                <FaMapMarkerAlt className={styles.actionIcon} />
              </div>
              <h4 className={styles.actionTitle}>Safe Zones</h4>
              <p className={styles.actionDescription}>Set up geofenced areas</p>
            </div>
            
            <div className={`${styles.quickActionCard} ${styles.actionCard}`}>
              <div className={styles.actionIconOrange}>
                <FaBell className={styles.actionIcon} />
              </div>
              <h4 className={styles.actionTitle}>Alerts</h4>
              <p className={styles.actionDescription}>View recent notifications</p>
            </div>
            
            <div className={`${styles.quickActionCard} ${styles.actionCard}`}>
              <div className={styles.actionIconPurple}>
                <FaShieldAlt className={styles.actionIcon} />
              </div>
              <h4 className={styles.actionTitle}>Security</h4>
              <p className={styles.actionDescription}>Manage account settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.section} ${styles.childrenSection}`}>
        <div className={styles.sectionContent}>
          <h3 className={styles.sectionTitle}>Your Children</h3>
          
          <div className={styles.childrenContainer}>
            <div className={styles.childCard}>
              <div className={styles.childIcon}>
                <FaChild className={styles.childIconImage} />
              </div>
              <div>
                <h4 className={styles.childName}>Sarah Johnson</h4>
                <p className={styles.childInfo}>Age 8 • Last seen: School</p>
              </div>
            </div>
            
            <div className={styles.childCard}>
              <div className={styles.childIcon}>
                <FaChild className={styles.childIconImage} />
              </div>
              <div>
                <h4 className={styles.childName}>Michael Johnson</h4>
                <p className={styles.childInfo}>Age 5 • Last seen: Home</p>
              </div>
            </div>
            
            <div className={styles.addChildContainer}>
              <button className={styles.addChildButton}>
                <FaPlus className={styles.plusIcon} />
                Add another child
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionContent}>
          <h3 className={styles.sectionTitle}>Emergency Actions</h3>
          
          <div className={styles.emergencyContainer}>
            <h4 className={styles.emergencyTitle}>Report Missing Child</h4>
            <p className={styles.emergencyDescription}>
              Immediately alert authorities and community members
            </p>
            <button className={`${styles.emergencyButton} ${styles.emergencyActionButton}`}>
              Activate Emergency Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
