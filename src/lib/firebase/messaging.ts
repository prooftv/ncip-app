export const canUseMessaging = () => {
  return typeof window !== 'undefined' && 
         'serviceWorker' in navigator && 
         'PushManager' in window &&
         'Notification' in window;
};

export const getFCMToken = async () => {
  if (!canUseMessaging()) return null;
  
  try {
    const { getMessaging, getToken } = await import('firebase/messaging');
    const messaging = getMessaging();
    return await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    });
  } catch (error) {
    console.error('FCM token error:', error);
    return null;
  }
};
