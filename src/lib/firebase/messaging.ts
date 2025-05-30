'use client'

import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { messaging } from './config';

export const isMessagingSupported = async () => {
  try {
    return await isSupported();
  } catch (error) {
    console.error('Messaging support check failed:', error);
    return false;
  }
};

export const requestNotificationPermission = async () => {
  if (!(await isMessagingSupported())) return false;
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Notification permission error:', error);
    return false;
  }
};

export const getFCMToken = async () => {
  if (!(await isMessagingSupported())) return null;
  
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    });
    return token;
  } catch (error) {
    console.error('FCM token error:', error);
    return null;
  }
};
