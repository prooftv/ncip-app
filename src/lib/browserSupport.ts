// Check if browser supports Firebase Messaging
export const isMessagingSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'indexedDB' in window
  );
};

// Check if browser supports all required features
export const isBrowserSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'indexedDB' in window &&
    'fetch' in window
  );
};

// Get unsupported browser message
export const getUnsupportedMessage = () => {
  if (typeof window === 'undefined') return '';
  
  const browser = {
    isIE: !!window.MSInputMethodContext && !!document.documentMode,
    isEdge: /Edge/.test(navigator.userAgent),
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };

  if (browser.isIE) return 'Internet Explorer is not supported. Please use Chrome, Firefox, or Edge.';
  if (browser.isEdge) return 'Your version of Edge may not support all features. Please update to the latest version.';
  if (browser.isSafari && browser.isMobile) return 'iOS Safari has limited support for notifications. Please use Chrome for iOS.';
  
  return 'Your browser does not support all required features. Please use Chrome, Firefox, or Edge.';
};
