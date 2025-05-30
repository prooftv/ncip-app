'use client'

import { useEffect } from 'react';
import { isMessagingSupported } from '@lib/firebase/messaging';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    const registerServiceWorker = async () => {
      const supported = await isMessagingSupported();
      if (!supported) {
        console.warn('Service workers not supported in this browser');
        return;
      }

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}
