'use client'

import { isMessagingSupported } from '@lib/browserSupport';
import { getMessagingInstance } from './config';

export const canUseMessaging = () => {
  return isMessagingSupported();
};

export const requestNotificationPermission = async () => {
  if (!canUseMessaging()) return false;
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Notification permission error:', error);
    return false;
  }
};

export const getFCMToken = async () => {
  if (!canUseMessaging()) return null;
  
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;
    
    const { getToken } = await import('firebase/messaging');
    return await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    });
  } catch (error) {
    console.error('FCM token error:', error);
    return null;
  }
};
