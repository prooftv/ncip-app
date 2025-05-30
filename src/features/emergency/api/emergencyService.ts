// ... existing imports ...

export const triggerEmergency = async (childId: string) => {
  try {
    // ... existing emergency logic ...

    // Only send notifications if messaging is supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const tokens = await getNotificationTokens();
      tokens.forEach(token => {
        sendNotification(token, childName, lastLocation);
      });
    }
  } catch (error) {
    console.error('Emergency trigger failed:', error);
    throw new Error('Emergency activation failed');
  }
};

// ... rest of the file ...
