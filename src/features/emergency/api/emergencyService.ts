import { db } from '@lib/firebase/config';
import { getFCMToken, canUseMessaging } from '@lib/firebase/messaging';
import { collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Types
export interface EmergencyData {
  id?: string;
  childId: string;
  childName: string;
  parentId: string;
  type: 'panic' | 'location' | 'manual' | 'geofence';
  status: 'active' | 'resolved' | 'false_alarm';
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: Date;
  };
  message?: string;
  createdAt: Date;
  resolvedAt?: Date;
  isPending?: boolean;
  notificationsSent?: boolean;
}

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Child data interface for type safety
interface ChildData {
  id: string;
  name: string;
  parentId: string;
  age?: number;
  guardians?: Array<{
    id: string;
    status: 'pending' | 'approved';
    email: string;
  }>;
  [key: string]: any; // Allow for additional properties
}

// Get child data
const getChildData = async (childId: string): Promise<ChildData> => {
  try {
    const childDoc = await getDoc(doc(db, 'children', childId));
    if (!childDoc.exists()) {
      throw new Error('Child not found');
    }
    
    const childData = childDoc.data();
    return { 
      id: childDoc.id, 
      name: childData.name || 'Unknown Child',
      parentId: childData.parentId || childData.guardianId || '',
      ...childData
    } as ChildData;
  } catch (error) {
    console.error('Error fetching child data:', error);
    throw error;
  }
};

// Get current location
const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

// Get notification tokens for emergency contacts
const getNotificationTokens = async (parentId: string): Promise<string[]> => {
  try {
    const tokensQuery = query(
      collection(db, 'notificationTokens'),
      where('userId', '==', parentId),
      where('active', '==', true)
    );
    
    const tokensSnapshot = await getDocs(tokensQuery);
    return tokensSnapshot.docs.map(doc => doc.data().token);
  } catch (error) {
    console.error('Error fetching notification tokens:', error);
    return [];
  }
};

// Send push notification
const sendNotification = async (token: string, notificationData: NotificationData) => {
  if (!canUseMessaging()) return;

  try {
    // This would typically be handled by your backend/cloud function
    // For now, we'll store the notification request in Firestore
    await addDoc(collection(db, 'notificationQueue'), {
      token,
      notification: notificationData,
      createdAt: new Date(),
      processed: false
    });
  } catch (error) {
    console.error('Error queuing notification:', error);
  }
};

// Store emergency offline if needed
const storeEmergencyOffline = (emergencyData: EmergencyData) => {
  if (typeof window === 'undefined') return;

  try {
    const pending = JSON.parse(localStorage.getItem('pendingEmergencies') || '[]');
    pending.push({
      ...emergencyData,
      isPending: true,
      offlineTimestamp: new Date().toISOString()
    });
    localStorage.setItem('pendingEmergencies', JSON.stringify(pending));
    console.log('Emergency stored offline');
  } catch (error) {
    console.error('Error storing emergency offline:', error);
  }
};

// Main emergency trigger function
export const triggerEmergency = async (
  childId: string, 
  type: EmergencyData['type'] = 'manual',
  message?: string
): Promise<string> => {
  try {
    // Get child data
    const childData = await getChildData(childId);
    
    // Validate that we have necessary data
    if (!childData.parentId) {
      throw new Error('Child has no associated parent/guardian');
    }
    
    // Get current location if available
    let location;
    try {
      const position = await getCurrentLocation();
      location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date()
      };
    } catch (locationError) {
      console.warn('Could not get current location:', locationError);
    }

    // Prepare emergency data
    const emergencyData: EmergencyData = {
      childId,
      childName: childData.name,
      parentId: childData.parentId,
      type,
      status: 'active',
      location,
      message,
      createdAt: new Date(),
      notificationsSent: false
    };

    let emergencyDocRef;

    try {
      // Try to save to Firestore
      emergencyDocRef = await addDoc(collection(db, 'emergencies'), emergencyData);
      console.log('Emergency saved to Firestore:', emergencyDocRef.id);
      
      // Update the emergency with its ID
      await updateDoc(emergencyDocRef, { id: emergencyDocRef.id });
      
    } catch (firestoreError) {
      console.error('Failed to save emergency to Firestore:', firestoreError);
      
      // Store offline if Firestore fails
      storeEmergencyOffline(emergencyData);
      toast.error('Emergency saved offline - will sync when connection restored');
      throw new Error('Emergency saved locally due to connection issues');
    }

    // Send notifications if messaging is supported
    if (canUseMessaging()) {
      try {
        const tokens = await getNotificationTokens(childData.parentId);
        
        const notificationData: NotificationData = {
          title: '🚨 Emergency Alert',
          body: `${childData.name} has triggered an emergency${location ? ' with location' : ''}`,
          data: {
            emergencyId: emergencyDocRef.id,
            childId,
            type,
            location: location ? JSON.stringify(location) : null
          }
        };

        // Send to all registered tokens
        const notificationPromises = tokens.map(token => 
          sendNotification(token, notificationData)
        );
        
        await Promise.allSettled(notificationPromises);
        
        // Mark notifications as sent
        await updateDoc(emergencyDocRef, { notificationsSent: true });
        
        toast.success('Emergency alert sent to all contacts');
        
      } catch (notificationError) {
        console.error('Error sending notifications:', notificationError);
        toast.warning('Emergency recorded but notifications may have failed');
      }
    }

    return emergencyDocRef.id;
    
  } catch (error) {
    console.error('Emergency trigger failed:', error);
    toast.error('Failed to trigger emergency');
    throw error;
  }
};

// Resolve emergency
export const resolveEmergency = async (
  emergencyId: string, 
  resolution: 'resolved' | 'false_alarm' = 'resolved'
): Promise<void> => {
  try {
    const emergencyRef = doc(db, 'emergencies', emergencyId);
    
    await updateDoc(emergencyRef, {
      status: resolution,
      resolvedAt: new Date()
    });

    // Send resolution notification
    if (canUseMessaging()) {
      const emergencyDoc = await getDoc(emergencyRef);
      if (emergencyDoc.exists()) {
        const emergencyData = emergencyDoc.data() as EmergencyData;
        const tokens = await getNotificationTokens(emergencyData.parentId);
        
        const notificationData: NotificationData = {
          title: '✅ Emergency Resolved',
          body: `Emergency for ${emergencyData.childName} has been ${resolution}`,
          data: {
            emergencyId,
            resolution
          }
        };

        tokens.forEach(token => sendNotification(token, notificationData));
      }
    }

    toast.success(`Emergency ${resolution}`);
    
  } catch (error) {
    console.error('Error resolving emergency:', error);
    toast.error('Failed to resolve emergency');
    throw error;
  }
};

// Get active emergencies for a parent
export const getActiveEmergencies = async (parentId: string): Promise<EmergencyData[]> => {
  try {
    const emergenciesQuery = query(
      collection(db, 'emergencies'),
      where('parentId', '==', parentId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(emergenciesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EmergencyData));
    
  } catch (error) {
    console.error('Error fetching active emergencies:', error);
    return [];
  }
};

// Get emergency history
export const getEmergencyHistory = async (
  parentId: string, 
  limitCount: number = 50
): Promise<EmergencyData[]> => {
  try {
    const emergenciesQuery = query(
      collection(db, 'emergencies'),
      where('parentId', '==', parentId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(emergenciesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EmergencyData));
    
  } catch (error) {
    console.error('Error fetching emergency history:', error);
    return [];
  }
};

// Register for emergency notifications
export const registerForEmergencyNotifications = async (userId: string): Promise<void> => {
  if (!canUseMessaging()) {
    console.warn('Messaging not supported on this device');
    return;
  }

  try {
    const token = await getFCMToken();
    if (!token) {
      throw new Error('Failed to get FCM token');
    }

    // Store the token in Firestore
    await addDoc(collection(db, 'notificationTokens'), {
      userId,
      token,
      createdAt: new Date(),
      active: true,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    });

    console.log('Successfully registered for emergency notifications');
    
  } catch (error) {
    console.error('Error registering for notifications:', error);
    throw error;
  }
};

// Test emergency system
export const testEmergencySystem = async (childId: string): Promise<void> => {
  try {
    await triggerEmergency(childId, 'manual', 'This is a test emergency');
    toast.info('Test emergency triggered successfully');
  } catch (error) {
    console.error('Test emergency failed:', error);
    toast.error('Test emergency failed');
    throw error;
  }
};