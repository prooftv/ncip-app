'use client'

import { useEffect } from 'react';
import { isMessagingSupported } from '@lib/browserSupport';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if (!isMessagingSupported()) {
        console.warn('Service workers not supported in this browser');
        return;
      }

      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered with scope:', registration.scope);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}
