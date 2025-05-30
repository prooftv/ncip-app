import { db } from '@lib/firebase/config';
import { 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc 
} from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

// Main emergency trigger function
export const triggerEmergency = async (childId: string) => {
  try {
    // 1. Save emergency record
    await addDoc(collection(db, 'emergencies'), {
      childId,
      timestamp: new Date(),
      status: 'active'
    });

    // 2. Get FCM tokens from users collection
    const tokens = await getNotificationTokens();
    
    // 3. Send notifications to all registered devices
    tokens.forEach(token => {
      sendNotification(token);
    });
  } catch (error) {
    console.error('Emergency trigger failed:', error);
    throw new Error('Emergency activation failed');
  }
};

// Helper function to retrieve device tokens
async function getNotificationTokens(): Promise<string[]> {
  try {
    const tokensSnapshot = await getDocs(collection(db, 'fcmTokens'));
    return tokensSnapshot.docs.map(doc => doc.data().token);
  } catch (error) {
    console.error('Failed to get notification tokens:', error);
    return [];
  }
}

// Send FCM notification to a specific device token
async function sendNotification(token: string) {
  const messaging = getMessaging();
  const message = {
    notification: {
      title: 'EMERGENCY ALERT!',
      body: 'A child has triggered an emergency alert',
    },
    token
  };
  
  try {
    await messaging.send(message);
    console.log(`Emergency notification sent to: ${token}`);
  } catch (error) {
    console.error('FCM send error:', error);
    // Remove invalid tokens from DB
    await removeInvalidToken(token);
  }
}

// Remove invalid token from Firestore
async function removeInvalidToken(token: string) {
  try {
    const tokensRef = collection(db, 'fcmTokens');
    const q = query(tokensRef, where('token', '==', token));
    const snapshot = await getDocs(q);
    
    snapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`Removed invalid token: ${token}`);
    });
  } catch (error) {
    console.error('Failed to remove invalid token:', error);
  }
}
