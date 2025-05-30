'use client'

import { useAuth } from '@features/auth/context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaChild, FaBell, FaMapMarkerAlt, FaShieldAlt, FaPlus, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import styles from './dashboard.module.css';
import { db } from '@lib/firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { triggerEmergency } from '@features/emergency/api/emergencyService';
import { getChildrenByGuardian } from '@features/child/api/childService';
import { canUseMessaging } from '@lib/firebase/messaging';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [childId, setChildId] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [children, setChildren] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [messagingSupported, setMessagingSupported] = useState(true);

  useEffect(() => {
    const checkNetworkStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    if (user) {
      setMessagingSupported(canUseMessaging());
      requestNotificationPermission();
      fetchChildren();
    }
  }, [user, loading, router]);

  const fetchChildren = async () => {
    if (!user) return;
    
    try {
      setFetchError('');
      const data = await getChildrenByGuardian(user.uid);
      setChildren(data);
    } catch (error) {
      console.error('Failed to fetch children:', error);
      setFetchError('Failed to load child data. Working in offline mode.');
      const cachedChildren = localStorage.getItem('cachedChildren');
      if (cachedChildren) {
        setChildren(JSON.parse(cachedChildren));
      }
    }
  };

  useEffect(() => {
    if (children.length > 0) {
      localStorage.setItem('cachedChildren', JSON.stringify(children));
    }
  }, [children]);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
        await saveFCMToken();
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  const saveFCMToken = async () => {
    if (!user || !messagingSupported) return;
    
    try {
      const token = await getFCMToken();
      
      if (token) {
        const tokensRef = collection(db, 'fcmTokens');
        const q = query(
          tokensRef, 
          where('userId', '==', user.uid),
          where('token', '==', token)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          await addDoc(tokensRef, {
            userId: user.uid,
            token,
            createdAt: new Date()
          });
          console.log('FCM token saved to Firestore');
        }
      }
    } catch (error) {
      console.error('Failed to save FCM token:', error);
    }
  };

  const handleEmergencyTest = async () => {
    if (!childId) {
      setTestStatus('Please select a child first');
      return;
    }
    
    try {
      setTestStatus('Triggering emergency...');
      await triggerEmergency(childId);
      setTestStatus('Emergency alert sent successfully!');
      
      setTimeout(() => setTestStatus(''), 5000);
    } catch (error) {
      setTestStatus(`Emergency test failed: ${(error as Error).message}`);
      console.error(error);
    }
  };

  const handleRealEmergency = async () => {
    if (!childId) {
      setTestStatus('Please select a child first');
      return;
    }
    
    if (confirm('Are you sure you want to activate a REAL emergency alert? This will notify authorities and community members.')) {
      try {
        setTestStatus('Triggering real emergency...');
        await triggerEmergency(childId);
        setTestStatus('Real emergency alert activated! Authorities have been notified.');
        
        setTimeout(() => setTestStatus(''), 5000);
      } catch (error) {
        setTestStatus(`Real emergency activation failed: ${(error as Error).message}`);
        console.error(error);
      }
    }
  };

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
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      {!isOnline && (
        <div className={styles.offlineBanner}>
          <FaExclamationTriangle className={styles.warningIcon} />
          <span>You are offline. Some features may be limited.</span>
          <button 
            onClick={fetchChildren} 
            className={styles.refreshButton}
          >
            Refresh Data
          </button>
        </div>
      )}
      
      {!messagingSupported && (
        <div className={styles.browserWarning}>
          <FaExclamationTriangle className={styles.warningIcon} />
          <span>Push notifications not supported. Some features may be limited.</span>
        </div>
      )}

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
            {children.map(child => (
              <div 
                key={child.id} 
                className={styles.childCard}
                onClick={() => setChildId(child.id)}
                style={{ 
                  border: childId === child.id 
                    ? '2px solid #3182ce' 
                    : '1px solid #e2e8f0' 
                }}
              >
                <div className={styles.childIcon}>
                  <FaChild className={styles.childIconImage} />
                </div>
                <div>
                  <h4 className={styles.childName}>{child.name}</h4>
                  <p className={styles.childInfo}>Age {child.age} • Last seen: {child.lastSeen?.location || 'Unknown'}</p>
                </div>
              </div>
            ))}
            
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
            
            <div className={styles.emergencyTestContainer}>
              <div className={styles.childSelection}>
                <p className={styles.testLabel}>Selected child:</p>
                {childId ? (
                  <div className={styles.selectedChild}>
                    {children.find(c => c.id === childId)?.name || 'Unknown child'}
                  </div>
                ) : (
                  <p className={styles.noSelection}>No child selected</p>
                )}
              </div>
              
              <div className={styles.emergencyButtons}>
                <button 
                  onClick={handleEmergencyTest}
                  className={`${styles.emergencyButton} ${styles.testButton}`}
                  disabled={!childId}
                >
                  Test Emergency Alert
                </button>
                
                <button 
                  onClick={handleRealEmergency}
                  className={`${styles.emergencyButton} ${styles.realEmergencyButton}`}
                  disabled={!childId}
                >
                  Activate Real Emergency Alert
                </button>
              </div>
              
              {testStatus && (
                <div className={`${styles.testStatus} ${
                  testStatus.includes('failed') ? styles.error : styles.success
                }`}>
                  {testStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
